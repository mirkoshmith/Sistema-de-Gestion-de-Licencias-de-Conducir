'use client';

import React, { useState } from 'react';
import { Form, Input, Button, Checkbox, Typography, Card, Flex, message, Modal } from 'antd';
import { UserOutlined, LockOutlined, SafetyCertificateOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';

const { Title, Text, Link } = Typography;

export default function LoginAdministrativo() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState<boolean>(false);
    const router = useRouter();

    const autenticar = async (values: any) => {
        try {
            const response = await fetch(`http://localhost:8080/api/usuarios/auth?usuario=${values.username}&contrasenia=${values.password}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (response.ok) {
                message.success('¡Autenticación exitosa! Iniciando sesión en el sistema...');
                sessionStorage.setItem('usuario', JSON.stringify(await response.json()));
                router.push('/menu');
            } else {
                message.error('Credenciales inválidas. Por favor, intente de nuevo.');
            }
        } catch (e) {
            console.error(e);
        }
    }

    return (
        <Flex style={{ height: '100vh', maxHeight: '100vh', overflow: 'hidden', background: '#ffffff' }}>

            <Flex
                vertical
                justify="space-between"
                align="start"
                style={{
                    width: '45%',
                    background: 'linear-gradient(135deg, #001529 0%, #1677ff 100%)',
                    padding: '40px',
                    position: 'relative'
                }}
            >
                <Flex align="center" gap="8px">
                    <SafetyCertificateOutlined style={{ color: '#ffffff', fontSize: '24px' }} />
                    <Text strong style={{ color: '#ffffff', letterSpacing: '1px', fontSize: '14px' }}>
                        SISTEMA ÚNICO DE LICENCIAS
                    </Text>
                </Flex>

                <div style={{ maxWidth: '85%' }}>
                    <Title level={1} style={{ color: '#ffffff', margin: 0, fontWeight: 800, fontSize: '36px', lineHeight: '1.2' }}>
                        Módulo de Gestión Administrativa
                    </Title>
                    <Text style={{ color: 'rgba(255,255,255,0.75)', fontSize: '16px', display: 'block', marginTop: '12px' }}>
                        Acceso exclusivo para operadores gubernamentales autorizados de la Provincia de Santa Fe.
                    </Text>
                </div>

                <Text style={{ color: 'rgba(255,255,255,0.45)', fontSize: '12px' }}>
                    © 2026 Región Santa Fe. Todos los derechos reservados.
                </Text>
            </Flex>

            <Flex
                justify="center"
                align="center"
                style={{ width: '55%', background: '#f8fafc', padding: '40px' }}
            >
                <Card
                    variant="borderless"
                    style={{
                        width: '100%',
                        maxWidth: '420px',
                        background: '#ffffff',
                        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.03)',
                        borderRadius: '12px',
                        padding: '24px 16px'
                    }}
                >
                    <div style={{ marginBottom: '32px' }}>
                        <Title level={3} style={{ margin: 0, fontWeight: 700, color: '#1e293b' }}>
                            Ingresar al Sistema
                        </Title>
                        <Text type="secondary" style={{ fontSize: '14px' }}>
                            Por favor, introduzca sus credenciales operativas.
                        </Text>
                    </div>

                    <Form
                        name="login_admin"
                        layout="vertical"
                        initialValues={{ remember: true }}
                        onFinish={autenticar}
                        requiredMark={false}
                    >
                        <Form.Item
                            name="username"
                            label={<Text strong style={{ color: '#475569', fontSize: '13px' }}>Usuario o Legajo</Text>}
                            rules={[{ required: true, message: 'El usuario/legajo es obligatorio.' }]}
                        >
                            <Input
                                size="large"
                                prefix={<UserOutlined style={{ color: '#94a3b8' }} />}
                                placeholder="Ej: admin_santafe"
                                style={{ borderRadius: '6px' }}
                            />
                        </Form.Item>

                        <Form.Item
                            name="password"
                            label={
                                <Flex gap="3px" align="baseline">
                                    <Text strong style={{ color: '#475569', fontSize: '13px' }}>Contraseña</Text>
                                    <Link style={{ fontSize: '12px' }} onClick={() => setIsModalOpen(true)}>¿Olvidaste tu Contraseña?</Link>
                                </Flex>
                            }
                            rules={[{ required: true, message: 'Por favor, ingrese su contraseña.' }]}
                        >
                            <Input.Password
                                size="large"
                                prefix={<LockOutlined style={{ color: '#94a3b8' }} />}
                                placeholder="••••••••"
                                style={{ borderRadius: '6px' }}
                            />
                        </Form.Item>

                        <Form.Item name="remember" valuePropName="checked" style={{ marginBottom: '24px' }}>
                            <Checkbox><Text style={{ color: '#64748b' }}>Recordar Usuario/Legajo</Text></Checkbox>
                        </Form.Item>

                        <Form.Item style={{ margin: 0 }}>
                            <Button
                                type="primary"
                                htmlType="submit"
                                size="large"
                                block
                                loading={loading}
                                style={{
                                    height: '48px',
                                    fontSize: '15px',
                                    fontWeight: 'bold',
                                    borderRadius: '6px',
                                    background: '#1677ff',
                                    boxShadow: '0 4px 12px rgba(22, 119, 255, 0.2)'
                                }}
                            >
                                {loading ? 'Autenticando...' : 'Iniciar Sesión'}
                            </Button>
                        </Form.Item>
                    </Form>
                </Card>
            </Flex>

            <Modal
                title={<Title level={4} style={{ margin: 0 }}>Recuperación de Credenciales Operativas</Title>}
                open={isModalOpen}
                onOk={() => setIsModalOpen(false)}
                onCancel={() => setIsModalOpen(false)}
                okText="Entendido"
                styles={{ body: { paddingBottom: 0 } }}
                cancelButtonProps={{ style: { display: 'none' } }}
                centered
            >
                <Flex vertical gap="12px" style={{ marginTop: '16px' }}>
                    <Text>
                        Por motivos de seguridad y auditoría (Normativa de Seguridad de la Información), el blanqueo de claves debe ser gestionado exclusivamente por el área de soporte técnico.
                    </Text>
                    <div style={{ background: '#f5f7fa', padding: '12px', borderRadius: '6px', border: '1px solid #f0f0f0' }}>
                        <Text style={{ display: 'block', fontWeight: 'bold' }}>Mesa de Ayuda — Región Santa Fe</Text>
                        <Text style={{ display: 'block' }} type="secondary">✉️ Soporte: soporte.licencias@santafe.gov.ar</Text>
                    </div>
                    <Text type="secondary" style={{ fontSize: '12px' }}>
                        Deberá indicar su número de legajo y el código de la terminal operativa actual.
                    </Text>
                </Flex>
            </Modal>

        </Flex>
    );
}