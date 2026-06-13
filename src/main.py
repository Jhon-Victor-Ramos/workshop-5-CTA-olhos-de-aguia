import cv2
import time
import dynamicLogger
import numpy as np
from droneController import connect_drone, set_mode_and_arm, send_roll_control, disarm


# Conectando-se ao servidor local onde aparecerá a imagem do celular
CAMERA_URL = "https://172.17.9.130:8080/video"

def main():
    # Criando a captura da câmera via servidor local
    camera = cv2.VideoCapture(CAMERA_URL)

    # Para teste, a câmera usada será a webcam padrão do notebook
    # camera = cv2.VideoCapture(0)

    # Se a câmera não abrir, tentar novamente, mas mostrar para o usuário o problema
    if not camera.isOpened():
        dynamicLogger.dynamic_log("ERROR",
                                  "Não foi possível realizar a conexão com a câmera.",
                                  "Possível solução: Verifique o IP e a conexão Wi-Fi.")
        return

    drone = connect_drone('COM6')
    set_mode_and_arm(drone)

    # Conseguiu conectar à câmera
    dynamicLogger.dynamic_log("INFO",
                              "Conexão com a câmera bem-sucedida!",
                              "Presione 'f' para fechar o vídeo!")

    while True:
        # Lê o vetor retornado por `read` e armazena em `ret` (return) e `frame` (a imagem)
        ret, frame = camera.read()

        # Se não tenho retorno, tenta conectar novamente
        if not ret:
            dynamicLogger.dynamic_log("ERROR",
                                      "Conexão com a câmera perdida!",
                                      "Drone desarmado por segurança.")
            disarm(drone)
            break

        # Invertendo a câmera para testar com o celular.
        # Se não tiver com o celular com a câmera de cabeça para baixo, comente a linha abaixo!
        frame = cv2.rotate(frame, cv2.ROTATE_180)

        # Redimensiona a imagem capturada para melhor processamento na CPU
        screen_size_x = 600
        screen_size_y = 600
        resized_frame = cv2.resize(frame, (screen_size_x, screen_size_y))

        # Conversão de BGD para HSV
        hsv = cv2.cvtColor(resized_frame, cv2.COLOR_BGR2HSV)
        # Definindo os dois intervalos da cor vermelha em HSV (espectro baixo e alto)
        lower_red1 = np.array([0, 100, 100], dtype="uint8")
        upper_red1 = np.array([10, 255, 255], dtype="uint8")

        lower_red2 = np.array([170, 100, 100], dtype="uint8")
        upper_red2 = np.array([180, 255, 255], dtype="uint8")

        # Criando as máscaras para cada intervalo
        mask1 = cv2.inRange(hsv, lower_red1, upper_red1)
        mask2 = cv2.inRange(hsv, lower_red2, upper_red2)

        # Juntando as duas máscaras para criar o filtro final da cor vermelha
        mask = cv2.bitwise_or(mask1, mask2)

        # Encontrando contornos na imagem
        contours, _ = cv2.findContours(mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

        # Se pelo menos 1 contorno foi encontrado
        if len(contours) > 0:
            # Captura o maior contorno
            larger = max(contours, key=cv2.contourArea)

            # Mede o tamanho dese contorno para saber se é ruído ou não
            area = cv2.contourArea(larger)

            if area > 200:
                # Vai pegar as coordenadas x e y (origem), w e h (lagura e altura)
                x, y, w, h = cv2.boundingRect(larger)

                # Desenha o retângulo no objeto
                cv2.rectangle(resized_frame, (x, y), (x + w, y + h), (0, 255, 0), 2)

                # Com o objeto encontrado, deve-se calcular o centro dele
                target_center_x = x + (w // 2)
                target_center_y = y + (h // 2)

                # Tendo o centro do objeto, calcula-se onde ele está em relação ao centro da tela
                screen_center_x = screen_size_x / 2
                screen_center_y = screen_size_y / 2
                position_x = target_center_x - screen_center_x
                position_y = screen_center_y - target_center_y # Inverti a ordem, pois, no eixo Y, o OpenCV considera ao contrário (0 é o topo)

                # Calculando o erro
                normalized_x = position_x / screen_center_x
                normalized_y = position_y / screen_center_y

                # Criando retornos mais intuitivos no terminal
                # Códigos de cores para o destaque
                COLOR_CYAN = "\033[1;36m"
                COLOR_RESET = "\033[0m"

                # 1. Definimos o texto puro e aplicamos o alinhamento de 10 caracteres primeiro
                if normalized_x > 0.15:
                    raw_x = f"{'DIREITA':<10}"
                    dir_x = f"{COLOR_CYAN}{raw_x}{COLOR_RESET}"  # Colore após o alinhamento
                elif normalized_x < -0.15:
                    raw_x = f"{'ESQUERDA':<10}"
                    dir_x = f"{COLOR_CYAN}{raw_x}{COLOR_RESET}"
                else:
                    dir_x = f"{'ALINHADO':<10}"  # Mantém padrão sem cor forte

                # No eixo Y
                if normalized_y > 0.15:
                    raw_y = f"{'SUBIR':<10}"
                    dir_y = f"{COLOR_CYAN}{raw_y}{COLOR_RESET}"
                elif normalized_y < -0.15:
                    raw_y = f"{'DESCER':<10}"
                    dir_y = f"{COLOR_CYAN}{raw_y}{COLOR_RESET}"
                else:
                    dir_y = f"{'ALINHADO':<10}"

                # Print mostrando a decisão tomada pelo drone
                dynamicLogger.dynamic_log("INFO",
                                          f"Alvo Rastreado | Direção X: {dir_x:<10} | Direção Y: {dir_y:<10} | Erros -> X: {normalized_x:+.2f} ; Y: {normalized_y:+.2f}")


                # O canal 1 controla o Roll do drone (se ele, o drone, vai para a direita ou esquerda).
                # O padrão centralizado é 1500ms.
                # Pegar o erro mapeado para somar ou subtrair desse valor.
                pwm_output = int(1500 + (normalized_x * 200))

                # Vai garantir que o valor não passe dos limites seguros do rádio (1300 a 1700)
                pwm_output = max(1300, min(pwm_output, 1700))

                # Envia o comando de controle dinâmico para a Pixhawk
                send_roll_control(drone, pwm_output)

                # Desenhando um círculo no centro
                cv2.circle(resized_frame, (int(screen_center_x), int(screen_center_y)), 5, (0, 0, 255), -1)
            else:
                # Alvo visível, mas muito pequeno (ruído): neutraliza o Roll
                send_roll_control(drone, 1500)

        else:
            # Nenhum contorno encontrado na tela: neutraliza o Roll
            send_roll_control(drone, 1500)

        # Exibe a imagem armazenada em resized_frame
        cv2.imshow("Teste", resized_frame)
        cv2.imshow("Mascara vermelha", mask)

        # Verifica a cada milissegundo se a tecla f foi pressionada.
            # Caso tenha sido, dá um break e a janela do vídeo é fechada
        if cv2.waitKey(1) & 0xFF == ord('f'):
            break

    # Desarma o drone para garantir que ele pare ao parar de "ver"
    disarm(drone)
    # Encerramento do vídeo
        # "Libera" a câmera
    camera.release()
        # Elimina a(s) janela(s) criada(s)
    cv2.destroyAllWindows()
    dynamicLogger.dynamic_log("INFO",
                              "Programa encerrado corretamente.")

if __name__ == "__main__":
    main()