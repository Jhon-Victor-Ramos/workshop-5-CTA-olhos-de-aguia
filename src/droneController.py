from pymavlink import mavutil
import dynamicLogger
import time

def connect_drone(port: str, baudrate: int = 115200):
    # Realiza conexão com a porta informada
    connection = mavutil.mavlink_connection(port, baud=baudrate)
    dynamicLogger.dynamic_log("INFO",
                              "Aguardando batimento cardiaco (Heartbeat) da Pixhawk...")

    # Testa se a conexão realmente existe
    connection.wait_heartbeat()

    dynamicLogger.dynamic_log("SUCCESS",
                              f"Heartbeat from system (System: {connection.target_system} ; Component: {connection.target_component} )")

    return connection

def set_mode_and_arm(connection):
    # Altera o modo de voo
    connection.set_mode('STABILIZE')
    dynamicLogger.dynamic_log("INFO",
                              "Modo de voo foi definido para STABILIZE.")

    # Arma o drone
    connection.arducopter_arm()
    dynamicLogger.dynamic_log("INFO",
                              "Motores foram armados.")

def disarm(connection):
    # Desarma o drone
    connection.arducopter_disarm()
    dynamicLogger.dynamic_log("INFO",
                              "Motores foram desarmados.")

def send_roll_control(connection, pwm_value: int):
    # Se o componente detectado for inválido (0), força para autopilot (1)
    comp_id = connection.target_component if connection.target_component != 0 else 1
    # Comando fictício para o drone, fingindo ser o control
    connection.mav.rc_channels_override_send(
        connection.target_system, # ID do drone
        comp_id, # ID do componente interno
        pwm_value, 0, 1050, 0, 0, 0, 0, 0
    )
    '''
        * pwm_value — Canal 1, roll:           Valor dinâmico captado do erro de visão;
        * Primeiro zero — Canal 2, pitch:      Fica como 0 para deixar o rádio físico livre;
        * 1150 — Canal 3, throttle/aceleração: Fica como 1150 para garantir que os motores rodem devagar durante todo o teste;
        * Segundo zero — Canal 4, yaw/rotação: Mantido em 0 para deixar livre;
        * 0, 0, 0, 0 — Canais de 5 a 8:        Todos em 0 para manter livres. 
    '''