'use client';

import React, { useState } from 'react';
import { Form, Input, Select, Button, DatePicker, Radio, Card, Row, Col, Space, Divider, Typography, message, Tag, Flex } from 'antd';
import { UserOutlined, IdcardOutlined, HomeOutlined, HeartOutlined, SolutionOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

const { Option } = Select;
const { Title, Text } = Typography;

export default function AltaTitularPremium() {
    const [form] = Form.useForm();
    const [edadCalculada, setEdadCalculada] = useState<number | null>(null);

    const manejarCambioFecha = (fecha: any) => {
        if (fecha) {
            const edad = dayjs().diff(dayjs(fecha), 'year');
            setEdadCalculada(edad);

            const clase = form.getFieldValue('claseSolicitada');
            evaluarRestriccionesEdad(edad, clase);
        } else {
            setEdadCalculada(null);
        }
    };

    const evaluarRestriccionesEdad = (fecha: any, clase: string): { valido: boolean; mensaje?: string } => {
        if (!fecha) return { valido: true };

        const edad = dayjs().diff(dayjs(fecha), 'year');
        if (['C', 'D', 'E'].includes(clase)) {
            if (edad < 21) {
                return {
                    valido: false,
                    mensaje: `La obtención de esta licencia requiere un mínimo de 21 años.`
                };
            }
        } else {
            if (edad < 17) {
                return {
                    valido: false,
                    mensaje: `La obtención de esta licencia requiere un mínimo de 17 años.`
                };
            }
        }

        return { valido: true };
    };

    const onFinish = async (values: any) => {
        const strSangre = values.grupoSanguineo;
        const grupo = strSangre.slice(0, -1);
        const factorSigno = strSangre.slice(-1);
        const factorEnum = factorSigno === '+' ? 'POSITIVO' : 'NEGATIVO';

        const payload = {
            nombre: values.nombre,
            apellido: values.apellido,
            tipoDocumento: values.tipoDoc,
            nroDocumento: values.nroDoc,
            direccion: values.direccion,
            grupoSanguineo: grupo,
            factorRh: factorEnum,
            fechaNacimiento: values.fechaNacimiento ? values.fechaNacimiento.format('YYYY-MM-DD') : null,
            donante: values.donante === 'SI',
            claseSolicitada: values.claseSolicitada
        };

        try {
            const response = await fetch('http://localhost:8080/api/titulares/alta', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            const respuestaTexto = await response.text();

            if (response.ok) {
                message.success('¡Titular registrado con éxito en la Base de Datos!');
                form.resetFields();
                setEdadCalculada(null);
            } else {
                message.error(respuestaTexto || 'Error al registrar el titular.');
            }
        } catch (error) {
            console.error('Error de red:', error);
            message.error('No se pudo conectar con el servidor de Spring Boot. ¿Está encendido?');
        }
    };
    return (
        <div style={{
            background: '#f5f7fa',
            height: '100vh',
            maxHeight: '100vh',
            overflow: 'hidden',
            padding: '30px 20px 10px 20px'
        }}>
            <div style={{ maxWidth: 850, margin: '0 auto' }}>

                <Flex
                    align="center"
                    gap="12px"
                    style={{ marginBottom: '18px' }}
                >
                    <div style={{
                        width: '4px',
                        height: '32px',
                        backgroundColor: '#1677ff',
                        borderRadius: '2px'
                    }} />

                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <Title
                            level={3}
                            style={{
                                margin: 0,
                                fontWeight: 700,
                                letterSpacing: '-0.02em',
                                lineHeight: '1.2'
                            }}
                        >
                            <span style={{ color: '#8c8c8c', fontWeight: 400 }}>Región</span>{' '}
                            <span style={{
                                background: 'linear-gradient(45deg, #141414, #1677ff)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                fontWeight: 800
                            }}>
                                Santa Fe
                            </span>
                            <span style={{ color: '#bfbfbf', fontWeight: 300, margin: '0 8px' }}>|</span>
                            <span style={{ color: '#434343', fontSize: '18px', fontWeight: 500, verticalAlign: 'middle' }}>
                                Gestión de Trámites
                            </span>
                        </Title>
                    </div>
                </Flex>

                <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
                    initialValues={{ donante: 'NO', claseSolicitada: 'B', tipoDoc: 'DNI' }}
                >
                    <Flex vertical gap="10px" style={{ display: 'flex' }}>

                        <Card
                            title={<span><IdcardOutlined style={{ marginRight: 8, color: '#1677ff' }} /> Documentación de Identidad</span>}
                            variant="borderless"
                            style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}
                        >
                            <Row gutter={16}>
                                <Col span={8}>
                                    <Form.Item name="tipoDoc" label="Tipo de Documento" rules={[{ required: true }]}>
                                        <Select size="large">
                                            <Option value="DNI">DNI (Documento Único)</Option>
                                            <Option value="LC">LC (Libreta Cívica)</Option>
                                            <Option value="LE">LE (Libreta de Enrolamiento)</Option>
                                        </Select>
                                    </Form.Item>
                                </Col>
                                <Col span={16}>
                                    <Form.Item
                                        name="nroDoc"
                                        label="Número de Documento"
                                        rules={[
                                            { required: true, message: 'El número de documento es obligatorio para evitar duplicados.' },
                                            { pattern: /^[0-9]+$/, message: 'Ingrese únicamente caracteres numéricos.' },
                                            { min: 7, message: 'La longitud mínima es de 7 dígitos.' },
                                            { max: 8, message: 'La longitud máxima es de 8 dígitos.' }
                                        ]}
                                    >
                                        <Input size="large" placeholder="Ej: 45123456" maxLength={8} />
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Card>

                        <Card
                            title={<span><UserOutlined style={{ marginRight: 8, color: '#52c41a' }} /> Datos Personales del Contribuyente</span>}
                            variant="borderless"
                            style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}
                        >
                            <Row gutter={16}>
                                <Col span={12}>
                                    <Form.Item name="apellido" label="Apellido(s)" rules={[{ required: true, message: 'Falta ingresar el apellido.', whitespace: true }]}>
                                        <Input size="large" placeholder="Ej: Rossi" />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item name="nombre" label="Nombre(s)" rules={[{ required: true, message: 'Falta ingresar el nombre.', whitespace: true }]}>
                                        <Input size="large" placeholder="Ej: Juan Ignacio" />
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Row gutter={16}>
                                <Col span={12}>
                                    <Form.Item
                                        name="fechaNacimiento"
                                        label="Fecha de Nacimiento"
                                        style={{ marginBottom: 4 }}
                                        rules={[
                                            { required: true, message: 'La fecha de nacimiento es obligatoria.' },
                                            ({ getFieldValue }) => ({
                                                validator(_, value) {
                                                    const clase = getFieldValue('claseSolicitada');
                                                    const resultado = evaluarRestriccionesEdad(value, clase);

                                                    if (resultado.valido) {
                                                        return Promise.resolve();
                                                    }
                                                    return Promise.reject(new Error(resultado.mensaje));
                                                },
                                            }),
                                        ]}
                                    >
                                        <DatePicker
                                            style={{ width: '100%' }}
                                            format="DD/MM/YYYY"
                                            placeholder="Seleccione"
                                            onChange={(fecha) => {
                                                if (fecha) {
                                                    setEdadCalculada(dayjs().diff(dayjs(fecha), 'year'));
                                                } else {
                                                    setEdadCalculada(null);
                                                }
                                                form.validateFields(['fechaNacimiento']);
                                            }}
                                        />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item name="direccion" label="Domicilio Residencial" rules={[{ required: true, message: 'La dirección es obligatoria.', whitespace: true }]}>
                                        <Space.Compact style={{ width: '100%' }} size="large">
                                            <Button icon={<HomeOutlined />} disabled style={{ background: '#f5f5f5', color: '#8c8c8c' }} />
                                            <Input placeholder="Ej: Alvear 3400, Santa Fe" />
                                        </Space.Compact>
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Card>

                        <Card
                            title={<span><SolutionOutlined style={{ marginRight: 8, color: '#722ed1' }} /> Información de Trámite y Salud</span>}
                            variant="borderless"
                            style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}
                        >
                            <Row gutter={16}>
                                <Col span={12}>
                                    <Form.Item name="grupoSanguineo" label="Grupo Sanguíneo y Factor RH" rules={[{ required: true, message: 'Dato crítico para el plástico físico.' }]}>
                                        <Select size="large" placeholder="Seleccionar combinación">
                                            {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(grupo => (
                                                <Option key={grupo} value={grupo}>Factor {grupo}</Option>
                                            ))}
                                        </Select>
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item name="claseSolicitada" label="Clase de Licencia Solicitada" style={{ marginBottom: 6 }}>
                                        <Select
                                            onChange={() => {
                                                if (form.getFieldValue('fechaNacimiento')) {
                                                    form.validateFields(['fechaNacimiento']);
                                                }
                                            }}
                                        >
                                            <Option value="A">Clase A (Motos)</Option>
                                            <Option value="B">Clase B (Autos)</Option>
                                            <Option value="C">Clase C (Camiones)</Option>
                                            <Option value="D">Clase D (Pasajeros)</Option>
                                            <Option value="E">Clase E (Articulados)</Option>
                                            <Option value="G">Clase G (Agrícola)</Option>
                                        </Select>
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Divider style={{ margin: '12px 0' }} />

                            <Row align="middle" justify="space-between">
                                <Col>
                                    <Space orientation="vertical" size={0}>
                                        <Text strong><HeartOutlined style={{ color: '#f5222d', marginRight: 4 }} /> Condición de Donante de Órganos</Text>
                                        <Text type="secondary" style={{ fontSize: '12px' }}>Manifestación expresa según la Ley de Trasplantes.</Text>
                                    </Space>
                                </Col>
                                <Col>
                                    <Form.Item name="donante" style={{ margin: 0 }}>
                                        <Radio.Group buttonStyle="solid" size="large">
                                            <Radio.Button value="SI">SÍ, SOY DONANTE</Radio.Button>
                                            <Radio.Button value="NO">NO SOY DONANTE</Radio.Button>
                                        </Radio.Group>
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Card>

                        <div style={{ marginTop: '12px', textAlign: 'right' }}>
                            <Button type="primary" htmlType="submit" size="large" style={{ minWidth: '100px', height: '48px', fontSize: '16px', borderRadius: '6px' }}>
                                Confirmar Registro
                            </Button>
                        </div>

                    </Flex>
                </Form>
            </div>
        </div>
    );
}