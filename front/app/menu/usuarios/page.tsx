'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Form, Input, Select, Button, Card, Typography, Flex, Row, Col, Modal, Divider, message } from 'antd';
import { ArrowLeftOutlined, SaveOutlined, UserOutlined, SafetyCertificateOutlined, ExclamationCircleOutlined, LockOutlined, IdcardOutlined, SearchOutlined } from '@ant-design/icons';

const { Option } = Select;
const { Title, Text } = Typography;
const { Search } = Input;

export default function EdicionUsuariosAdministrativos() {
    const router = useRouter();

    // Verificamos si estamos en el navegador antes de llamar a sessionStorage
    const usuarioStr = typeof window !== 'undefined' ? sessionStorage.getItem("usuario") : null;
    const usuario = usuarioStr ? JSON.parse(usuarioStr) : {};

    // GUARD: Si el usuario no es admin, lo pateamos al menú al instante
    useEffect(() => {
        // Nos aseguramos de que el código solo corra en el cliente
        if (typeof window !== 'undefined' && usuario.rol && usuario.rol !== 'ADMINISTRADOR') {
            message.error('Acceso denegado: Requiere privilegios de ADMINISTRADOR.');
            router.push('/menu');
        }
    }, [usuario.rol, router]);

    const [form] = Form.useForm();
    const [loading, setLoading] = useState<boolean>(false);
    const [buscando, setBuscando] = useState<boolean>(false);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState<boolean>(false);
    
    // Almacena los datos originales del usuario encontrado para poder modificarlos
    const [valoresEditados, setValoresEditados] = useState<any | null>(null);

    // FETCH GET: Buscar un usuario específico por su Username
    const buscarUsuario = async (usernameBuscado: string) => {
        if (!usernameBuscado.trim()) {
            message.warning('Por favor, ingrese un username para buscar.');
            return;
        }

        setBuscando(true);
        form.resetFields();
        setValoresEditados(null);

        try {
            const res = await fetch(`http://localhost:8080/api/usuarios/buscar?username=${usernameBuscado}`);
            if (res.ok) {
                const data = await res.json();
                form.setFieldsValue(data);
                setValoresEditados(data);
                message.success('Usuario encontrado. Ya puede editar sus datos.');
            } else {
                const errorMsg = await res.text();
                message.error(errorMsg || 'Error al buscar el usuario.');
            }
        } catch (error) {
            message.error('Error de conexión con el servidor.');
        } finally {
            setBuscando(false);
        }
    };

    const previsualizarCambios = (values: any) => {
        setValoresEditados({ ...valoresEditados, ...values });
        setIsConfirmModalOpen(true);
    };

    // FETCH PUT: Enviar los datos actualizados al backend
    const guardarCambiosConfirmados = async () => {
        setIsConfirmModalOpen(false);
        setLoading(true);
        try {
            // ID del admin para la auditoría (T-27)
            const idAdminLogueado = usuario.id;

            const response = await fetch(`http://localhost:8080/api/usuarios/modificar/${valoresEditados.id}?idAdmin=${idAdminLogueado}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(valoresEditados),
            });

            if (response.ok) {
                message.success('¡Usuario administrativo actualizado con éxito!');
                setValoresEditados(null);
                form.resetFields();
            } else {
                const errorMsg = await response.text();
                message.error(errorMsg || 'Error al guardar los cambios.');
            }
        } catch (error) {
            message.error('Error de red al intentar comunicarse con el backend.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ background: '#f5f7fa', height: '100vh', maxHeight: '100vh', overflow: 'hidden', padding: '30px 24px' }}>
            <div style={{ maxWidth: 850, margin: '0 auto' }}>
                <Flex align="center" justify="space-between" style={{ marginBottom: '24px' }}>
                    <Flex align="center" gap="14px">
                        <div style={{ width: '5px', height: '38px', backgroundColor: '#0958d9', borderRadius: '3px' }} />
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <Title level={2} style={{ margin: 0, fontWeight: 800, letterSpacing: '-0.02em', fontSize: '26px' }}>
                                <span style={{ color: '#8c8c8c', fontWeight: 400 }}>Módulo IT</span>{' '}
                                <span style={{ background: 'linear-gradient(45deg, #141414, #0958d9)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                                    Control de Personal
                                </span>
                            </Title>
                        </div>
                    </Flex>
                    <Button type="text" icon={<ArrowLeftOutlined />} onClick={() => router.push('/menu')}>
                        Volver al Menú
                    </Button>
                </Flex>

                <Flex vertical gap="16px">
                    <Card variant="borderless" style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.05)', borderRadius: '12px' }}>
                        <Text strong style={{ display: 'block', marginBottom: '12px', fontSize: '15px' }}>
                            Buscar operador en la Base de Datos
                        </Text>
                        <Search 
                            placeholder="Ingrese el Username del operador (Ej: admin_rosario)" 
                            allowClear 
                            enterButton="Buscar Usuario" 
                            size="large" 
                            onSearch={buscarUsuario} 
                            loading={buscando}
                        />
                    </Card>

                    <Form form={form} layout="vertical" onFinish={previsualizarCambios}>
                        <Card 
                            variant="borderless" 
                            style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.05)', borderRadius: '12px', opacity: valoresEditados ? 1 : 0.6 }}
                            actions={[
                                <Flex justify="end" style={{ padding: '0 24px 12px 0' }} key="actions">
                                    <Button type="primary" htmlType="submit" size="large" loading={loading} disabled={!valoresEditados} icon={<SaveOutlined />}>
                                        Guardar Cambios
                                    </Button>
                                </Flex>
                            ]}
                        >
                            <Row gutter={[20, 16]}>
                                <Col span={12}>
                                    <Form.Item name="nombre" label={<Text strong><UserOutlined /> Nombre</Text>} rules={[{ required: true, message: 'Obligatorio' }]}>
                                        <Input size="large" disabled={!valoresEditados} />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item name="apellido" label={<Text strong><UserOutlined /> Apellido</Text>} rules={[{ required: true, message: 'Obligatorio' }]}>
                                        <Input size="large" disabled={!valoresEditados} />
                                    </Form.Item>
                                </Col>
                                <Col span={8}>
                                    <Form.Item name="username" label={<Text strong><IdcardOutlined /> Username</Text>} rules={[{ required: true, message: 'Obligatorio' }]}>
                                        <Input size="large" disabled={!valoresEditados} />
                                    </Form.Item>
                                </Col>
                                <Col span={8}>
                                    <Form.Item name="password" label={<Text strong><LockOutlined /> Contraseña</Text>} rules={[{ required: true, message: 'Obligatorio' }]}>
                                        <Input.Password size="large" disabled={!valoresEditados} />
                                    </Form.Item>
                                </Col>
                                <Col span={8}>
                                    <Form.Item name="rol" label={<Text strong><SafetyCertificateOutlined /> Rol del Sistema</Text>} rules={[{ required: true }]}>
                                        <Select size="large" disabled={!valoresEditados}>
                                            <Option value="ADMINISTRADOR">Administrador</Option>
                                            <Option value="OPERADOR">Operador General</Option>
                                        </Select>
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Card>
                    </Form>
                </Flex>

                <Modal
                    title={<Flex align="center" gap="10px" style={{ color: '#faad14' }}><ExclamationCircleOutlined style={{ fontSize: '22px' }} /><span>Confirmar Modificación</span></Flex>}
                    open={isConfirmModalOpen}
                    onOk={guardarCambiosConfirmados}
                    onCancel={() => setIsConfirmModalOpen(false)}
                    okText="Confirmar y Registrar"
                    cancelText="Volver"
                    centered
                >
                    <Divider style={{ margin: '12px 0' }} />
                    <Text>Está a punto de modificar las credenciales del usuario <Text strong>{valoresEditados?.username}</Text>.</Text>
                    <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '8px', marginTop: '12px', border: '1px solid #e2e8f0' }}>
                        <Text style={{ display: 'block' }}>• Operador: {valoresEditados?.apellido}, {valoresEditados?.nombre}</Text>
                        <Text style={{ display: 'block', marginTop: '6px' }}>• Nuevo Rol: <span style={{color: '#0958d9', fontWeight: 700 }}>{valoresEditados?.rol}</span></Text>
                    </div>
                </Modal>
            </div>
        </div>
    );
}