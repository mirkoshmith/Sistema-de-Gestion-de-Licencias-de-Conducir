'use client';

import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Typography, Flex, Button, Divider } from 'antd';
import { useRouter } from 'next/navigation';
import {
    FileAddOutlined,
    ReloadOutlined,
    CopyOutlined,
    SearchOutlined,
    UsergroupAddOutlined,
    SafetyCertificateOutlined,
    PoweroffOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;

export default function MenuPrincipal() {
    const router = useRouter();
    const [isClient, setIsClient] = useState(false);

    // Evitamos el error de hidratación en Next.js
    useEffect(() => {
        setIsClient(true);
        if (sessionStorage.getItem('usuario') === null) {
            router.replace('/login');
        }
    }, [router]);

    const usuarioStr = typeof window !== 'undefined' ? sessionStorage.getItem("usuario") : null;
    const usuario = usuarioStr ? JSON.parse(usuarioStr) : {};
    
    const operador = {
        nombre: usuario.nombre,
        legajo: usuario.id,
        rol: usuario.rol
    };

    const irATramite = (ruta: string) => {
        router.push(`/${ruta}`);
    };

    // Prevenir renderizado hasta que el cliente esté montado
    if (!isClient) return null;

    return (
        <div style={{
            background: '#f8fafc',
            height: '100vh',
            maxHeight: '100vh',
            overflow: 'hidden',
            padding: '30px 20px 10px 20px'
        }}>
            <div style={{ maxWidth: 1000, margin: '0 auto' }}>

                <Row justify="space-between" align="middle" style={{ marginBottom: '24px' }}>
                    <Col>
                        <Flex align="center" gap="12px">
                            <div style={{ width: '4px', height: '32px', backgroundColor: '#1677ff', borderRadius: '2px' }} />
                            <Title level={3} style={{ margin: 0, fontWeight: 700, letterSpacing: '-0.02em' }}>
                                <span style={{ color: '#8c8c8c', fontWeight: 400 }}>Región</span>{' '}
                                <span style={{ background: 'linear-gradient(45deg, #141414, #1677ff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontWeight: 800 }}>
                                    Santa Fe
                                </span>
                                <span style={{ color: '#bfbfbf', fontWeight: 300, margin: '0 8px' }}>|</span>
                                <span style={{ color: '#434343', fontSize: '18px', fontWeight: 500 }}>Panel de Operaciones</span>
                            </Title>
                        </Flex>
                    </Col>
                    <Col>
                        <Flex align="center" gap="16px" style={{ background: '#ffffff', padding: '6px 16px', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 1px 2px rgba(0,0,0,0.02)' }}>
                            <div style={{ textAlign: 'right' }}>
                                <Text strong style={{ display: 'block', fontSize: '13px', color: '#1e293b' }}>{operador.nombre}</Text>
                                <Text type="secondary" style={{ fontSize: '11px' }}>Legajo: {String(operador.legajo).padStart(6, '0')}</Text>
                            </div>
                            <Button
                                type="text"
                                icon={<PoweroffOutlined style={{ color: '#ff4d4f', fontSize: '15px' }} />}
                                onClick={() => {
                                    sessionStorage.removeItem('usuario');
                                    irATramite('login');
                                }}
                            />
                        </Flex>
                    </Col>
                </Row>

                <div style={{ marginBottom: '16px' }}>
                    <Text strong style={{ color: '#475569', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        Gestión Operativa de Licencias
                    </Text>
                    <Divider style={{ margin: '8px 0 16px 0' }} />

                    <Row gutter={[16, 16]}>

                        <Col span={8}>
                            <Card
                                hoverable
                                variant="borderless"
                                onClick={() => irATramite('menu/renovacion')}
                                style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.02)', borderRadius: '10px', border: '1px solid #e2e8f0', textAlign: 'center', padding: '12px 0' }}
                            >
                                <ReloadOutlined style={{ fontSize: '32px', color: '#52c41a', background: '#f6ffed', padding: '16px', borderRadius: '50%', marginBottom: '12px' }} />
                                <Title level={5} style={{ margin: '0 0 4px 0', fontWeight: 600 }}>Renovar Licencia</Title>
                                <Text type="secondary" style={{ fontSize: '13px' }}>Renovación con cálculo de vigencia según edad.</Text>
                            </Card>
                        </Col>

                        <Col span={8}>
                            <Card
                                hoverable
                                variant="borderless"
                                onClick={() => irATramite('menu/alta')}
                                style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.02)', borderRadius: '10px', border: '1px solid #e2e8f0', textAlign: 'center', padding: '12px 0' }}
                            >
                                <FileAddOutlined style={{ fontSize: '32px', color: '#1677ff', background: '#e6f4ff', padding: '16px', borderRadius: '50%', marginBottom: '12px' }} />
                                <Title level={5} style={{ margin: '0 0 4px 0', fontWeight: 600 }}>Emitir Licencia</Title>
                                <Text type="secondary" style={{ fontSize: '13px' }}>Alta de titulares y emisión inicial.</Text>
                            </Card>
                        </Col>

                        <Col span={8}>
                            <Card
                                hoverable
                                variant="borderless"
                                onClick={() => irATramite('menu/copia')}
                                style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.02)', borderRadius: '10px', border: '1px solid #e2e8f0', textAlign: 'center', padding: '12px 0' }}
                            >
                                <CopyOutlined style={{ fontSize: '32px', color: '#722ed1', background: '#f9f0ff', padding: '16px', borderRadius: '50%', marginBottom: '12px' }} />
                                <Title level={5} style={{ margin: '0 0 4px 0', fontWeight: 600 }}>Emitir Copia</Title>
                                <Text type="secondary" style={{ fontSize: '13px' }}>Duplicados por extravío, robo o deterioro físico.</Text>
                            </Card>
                        </Col>

                        <Col span={24}>
                            <Card
                                hoverable
                                variant="borderless"
                                onClick={() => irATramite('menu/buscar')}
                                style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.02)', borderRadius: '10px', border: '1px solid #e2e8f0', padding: '4px 16px' }}
                            >
                                <Flex align="center" gap="20px">
                                    <SearchOutlined style={{ fontSize: '24px', color: '#fa8c16', background: '#fff7e6', padding: '14px', borderRadius: '50%' }} />
                                    <div style={{ flexGrow: 1 }}>
                                        <Title level={5} style={{ margin: '0 0 2px 0', fontWeight: 600 }}>Buscar Licencias</Title>
                                        <Text type="secondary" style={{ fontSize: '13px' }}>Consultas avanzadas en tiempo real de licencias expiradas y vigentes.</Text>
                                    </div>
                                </Flex>
                            </Card>
                        </Col>
                    </Row>
                </div>

                {/* RENDERIZADO CONDICIONAL: Solo los ADMINISTRADORES ven esta sección */}
                {operador.rol === 'ADMINISTRADOR' && (
                    <div style={{ marginTop: '24px' }}>
                        <Text strong style={{ color: '#475569', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                            Administración y Seguridad del Sistema
                        </Text>
                        <Divider style={{ margin: '8px 0 16px 0' }} />

                        <Row>
                            <Col span={24}>
                                <Card
                                    hoverable
                                    variant="borderless"
                                    onClick={() => irATramite('menu/usuarios')}
                                    style={{ background: '#ffffff', boxShadow: '0 4px 12px rgba(0,0,0,0.02)', borderRadius: '10px', border: '1px solid #cbd5e1', padding: '4px 16px' }}
                                >
                                    <Flex align="center" gap="20px">
                                        <UsergroupAddOutlined style={{ fontSize: '24px', color: '#0958d9', background: '#e6f4ff', padding: '14px', borderRadius: '50%' }} />
                                        <div style={{ flexGrow: 1 }}>
                                            <Title level={5} style={{ margin: '0 0 2px 0', fontWeight: 600 }}>Gestión de Usuarios Administrativos</Title>
                                            <Text type="secondary" style={{ fontSize: '13px' }}>Altas, modificaciones de roles operativos y auditoría de permisos del personal de la mesa de entradas.</Text>
                                        </div>
                                        <Button type="primary" ghost icon={<SafetyCertificateOutlined />}>Módulo IT</Button>
                                    </Flex>
                                </Card>
                            </Col>
                        </Row>
                    </div>
                )}

            </div>
        </div>
    );
}