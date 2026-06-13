def dynamic_log(log_type: str, text: str, description: str = None):
    # Configurando os tipos do logs e suas rotina básica de funcionamento (cor, símbolo e label no text)
    type_logs = {
        "INFO": {
            "label": "INFO",
            "color": "\033[1;37m",
            "symbol": "-"
        },
        "ERROR": {
            "label": "ERROR",
            "color": "\033[1;31m",
            "symbol": "×"
        },
        "WARNING": {
            "label": "WARNING",
            "color": "\033[1;33m",
            "symbol": "⚠"
        },
        "SUCCESS": {
            "label": "SUCCESS",
            "color": "\033[1;32m",
            "symbol": "✓"
        }
    }
    reset_color = "\033[0m"

    # ---------------------------------------
    # Capturando qual tipo de log será usado
        # Aqui, tenta-se buscar o tipo de log escolhido. Caso não consiga, seleciona-se o INFO como default.
    type_log = type_logs.get(log_type.upper(), type_logs["INFO"])

    # ---------------------------------------
    # Estruturando o log
        # O print dos logs segue o padrão abaixo:
            # [COR] [SIMBOLO] [TIPO]: [RESETAR_COR] [MESSAGEM] [(opcional) DESCRIÇÃO]
    print(f"{type_log['color']} {type_log['symbol']} {type_log['label']}:{reset_color} {text}")

    # Caso o log tenha uma descrição (como uma possível solução, por exemplo), esse bloco é "ativado"
    if description is not None:
        print(f" ╰─> {description}")