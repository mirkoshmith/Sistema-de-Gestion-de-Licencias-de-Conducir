'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Form, Input, Select, Button, Card, Typography, Flex, Row, Col, Modal, Divider, Tabs, message } from 'antd';
import { ArrowLeftOutlined, SaveOutlined, UserOutlined, SafetyCertificateOutlined, ExclamationCircleOutlined, LockOutlined, IdcardOutlined, SearchOutlined, UserAddOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';

const { Option } = Select;
const { Title, Text } = Typography;

export default function EdicionUsuariosAdministrativos() {
    const router = useRouter();

    const usuarioStr = typeof window !== 'undefined' ? sessionStorage.getItem("usuario") : null;
    const usuario = usuarioStr ? JSON.parse(usuarioStr) : {};

    useEffect(() => {
        if (typeof window !== 'undefined' && usuario.rol && usuario.rol !== 'ADMINISTRADOR') {
            message.error('Acceso denegado: Requiere privilegios de ADMINISTRADOR.');
            router.push('/menu');
        }
    }, [usuario.rol, router]);

    const [form] = Form.useForm();
    const [formAlta] = Form.useForm();
    const [loading, setLoading] = useState<boolean>(false);
    const [buscando, setBuscando] = useState<boolean>(false);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState<boolean>(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);

    const [valoresEditados, setValoresEditados] = useState<any | null>(null);
    const [usernameBuscado, setUsernameBuscado] = useState<string>('');

    const buscarUsuario = async () => {
        if (!usernameBuscado.trim()) {
            message.warning('Por favor, ingrese un usuario para buscar.');
            return;
        }

        setBuscando(true);
        form.resetFields();
        setValoresEditados(null);

        try {
            const res = await fetch(`http://localhost:8080/api/usuarios/buscar?username=${usernameBuscado.trim()}`);
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

    const guardarCambiosConfirmados = async () => {
        setIsConfirmModalOpen(false);
        setLoading(true);
        try {
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
                setUsernameBuscado('');
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

    const ejecutarEliminacionDefinitiva = async () => {
        setIsDeleteModalOpen(false);
        setLoading(true);
        try {
            const idAdminLogueado = usuario.id;
            const response = await fetch(`http://localhost:8080/api/usuarios/eliminar/${valoresEditados.id}?idAdmin=${idAdminLogueado}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                message.success('Usuario administrativo eliminado correctamente del sistema.');
                setValoresEditados(null);
                form.resetFields();
                setUsernameBuscado('');
            } else {
                const errorMsg = await response.text();
                message.error(errorMsg || 'Error al intentar eliminar el usuario.');
            }
        } catch (error) {
            message.error('Error de conexión al procesar la baja.');
        } finally {
            setLoading(false);
        }
    };

    const manejarAltaNuevoUsuario = async (values: any) => {
        setLoading(true);
        try {
            const idAdminLogueado = usuario.id;
            const response = await fetch(`http://localhost:8080/api/usuarios/alta?idAdmin=${idAdminLogueado}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(values),
            });

            if (response.ok) {
                message.success('¡Nuevo usuario administrativo registrado con éxito!');
                formAlta.resetFields();
            } else {
                const errorMsg = await response.text();
                message.error(errorMsg || 'Error al registrar el nuevo operador.');
            }
        } catch (error) {
            message.error('Error de red al intentar comunicarse con el backend.');
        } finally {
            setLoading(false);
        }
    };

    const renderPestañaModificar = () => (
        <Flex vertical gap="16px">
            <Card variant="borderless" style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.05)', borderRadius: '12px', padding: '8px' }}>
                <div style={{ marginBottom: '20px' }}>
                    <Text strong style={{ fontSize: '18px', color: '#1e293b', display: 'block' }}>Buscar por Usuario</Text>
                    <Text type="secondary" style={{ fontSize: '14px', display: 'block', marginTop: '6px' }}>Ingrese el identificador único exacto del operador para cargar sus credenciales.</Text>
                </div>
                <Flex gap="12px" style={{ width: '100%' }}>
                    <Input
                        placeholder="Escriba el usuario exacto"
                        size="large"
                        value={usernameBuscado}
                        onChange={(e) => setUsernameBuscado(e.target.value)}
                        onPressEnter={buscarUsuario}
                        style={{ height: '54px', fontSize: '16px' }}
                    />
                    <Button
                        type="primary"
                        size="large"
                        loading={buscando}
                        icon={<SearchOutlined />}
                        onClick={buscarUsuario}
                        style={{ height: '54px', padding: '0 24px', fontSize: '16px', fontWeight: 'bold', borderRadius: '8px' }}
                    >
                        Buscar
                    </Button>
                </Flex>
            </Card>

            <Form form={form} layout="vertical" onFinish={previsualizarCambios}>
                <Card
                    variant="borderless"
                    style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.05)', borderRadius: '12px' }}
                    actions={[
                        <Flex justify="space-between" style={{ padding: '0 24px 12px 24px' }} key="actions">
                            {valoresEditados ? (
                                <Button
                                    danger
                                    type="text"
                                    size="large"
                                    icon={<DeleteOutlined />}
                                    onClick={() => setIsDeleteModalOpen(true)}
                                    style={{ height: '48px', fontSize: '15px', fontWeight: '600' }}
                                >
                                    Eliminar Operador
                                </Button>
                            ) : <div />}
                            <Button
                                type="primary"
                                htmlType="submit"
                                size="large"
                                loading={loading}
                                disabled={!valoresEditados}
                                style={{ minWidth: '100px', height: '48px', fontSize: '16px', borderRadius: '6px' }}
                            >
                                Confirmar Cambios
                            </Button>
                        </Flex>
                    ]}
                >
                    <Row gutter={[20, 16]}>
                        <Col span={12}>
                            <Form.Item name="nombre" label={<Text strong style={{ color: '#475569', fontSize: '14px' }}><UserOutlined /> Nombre</Text>} rules={[{ required: true, message: 'El nombre es obligatorio.' }]}>
                                <Input size="large" disabled={!valoresEditados} style={{ height: '48px', fontSize: '15px' }} />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="apellido" label={<Text strong style={{ color: '#475569', fontSize: '14px' }}><UserOutlined /> Apellido</Text>} rules={[{ required: true, message: 'El apellido es obligatorio.' }]}>
                                <Input size="large" disabled={!valoresEditados} style={{ height: '48px', fontSize: '15px' }} />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item name="username" label={<Text strong style={{ color: '#475569', fontSize: '14px' }}><UserOutlined /> Usuario</Text>}>
                                <Input size="large" disabled style={{ height: '48px', fontSize: '15px', background: '#f1f5f9', color: '#64748b', fontWeight: 'bold' }} />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item name="password" label={<Text strong style={{ color: '#475569', fontSize: '14px' }}><LockOutlined /> Contraseña</Text>}>
                                <Input.Password size="large" disabled={!valoresEditados} placeholder="••••••••" style={{ height: '48px', fontSize: '15px' }} />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item name="rol" label={<Text strong style={{ color: '#475569', fontSize: '14px' }}><SafetyCertificateOutlined /> Rol del Sistema</Text>} rules={[{ required: true, message: 'Seleccione un rol.' }]}>
                                <Select size="large" disabled={!valoresEditados} style={{ height: '48px', fontSize: '15px' }}>
                                    <Option value="ADMINISTRADOR">ADMINISTRADOR</Option>
                                    <Option value="OPERADOR">OPERADOR</Option>
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>
                </Card>
            </Form>
        </Flex>
    );

    const renderPestañaAlta = () => (
        <Form form={formAlta} layout="vertical" onFinish={manejarAltaNuevoUsuario}>
            <Card
                variant="borderless"
                style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.05)', borderRadius: '12px' }}
                actions={[
                    <Flex justify="end" style={{ padding: '0 24px 12px 0' }} key="actions">
                        <Button
                            type="primary"
                            htmlType="submit"
                            size="large"
                            loading={loading}
                            style={{ minWidth: '100px', height: '48px', fontSize: '16px', borderRadius: '6px' }}
                        >
                            Dar de Alta Usuario
                        </Button>
                    </Flex>
                ]}
            >
                <Row gutter={[20, 16]}>
                    <Col span={12}>
                        <Form.Item name="username" label={<Text strong style={{ color: '#475569', fontSize: '14px' }}><UserOutlined /> Asignar Usuario</Text>} rules={[{ required: true, message: 'El usuario es obligatorio.' }]}>
                            <Input size="large" placeholder="Ej: jperez" style={{ height: '48px', fontSize: '15px' }} />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item name="password" label={<Text strong style={{ color: '#475569', fontSize: '14px' }}><LockOutlined /> Contraseña</Text>} rules={[{ required: true, message: 'La contraseña es obligatoria.' }]}>
                            <Input.Password size="large" placeholder="••••••••" style={{ height: '48px', fontSize: '15px' }} />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item name="apellido" label={<Text strong style={{ color: '#475569', fontSize: '14px' }}><UserOutlined /> Apellido</Text>} rules={[{ required: true, message: 'El apellido es obligatorio.' }]}>
                            <Input size="large" placeholder="Ej: Perez" style={{ height: '48px', fontSize: '15px' }} />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item name="nombre" label={<Text strong style={{ color: '#475569', fontSize: '14px' }}><UserOutlined /> Nombre</Text>} rules={[{ required: true, message: 'El nombre es obligatorio.' }]}>
                            <Input size="large" placeholder="Ej: Juan" style={{ height: '48px', fontSize: '15px' }} />
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Form.Item name="rol" label={<Text strong style={{ color: '#475569', fontSize: '14px' }}><SafetyCertificateOutlined /> Seleccionar Rol Administrativo</Text>} rules={[{ required: true, message: 'Seleccione un rol.' }]}>
                            <Select size="large" placeholder="Seleccione permisos..." style={{ height: '48px', fontSize: '15px' }}>
                                <Option value="ADMINISTRADOR">ADMINISTRADOR</Option>
                                <Option value="OPERADOR">OPERADOR</Option>
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>
            </Card>
        </Form>
    );

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
                                <span style={{ color: '#bfbfbf', fontWeight: 300, margin: '0 10px' }}>|</span>
                                <span style={{ color: '#262626', fontSize: '20px', fontWeight: 600, verticalAlign: 'middle' }}>
                                    Configuración de Usuarios
                                </span>
                            </Title>
                        </div>
                    </Flex>
                    <Button
                        type="text"
                        icon={<ArrowLeftOutlined style={{ fontSize: '16px' }} />}
                        onClick={() => router.push('/menu')}
                        disabled={loading}
                        style={{ display: 'flex', alignItems: 'center', fontWeight: 600, color: '#475569', fontSize: '15px', height: '40px' }}
                    >
                        Volver al Menú
                    </Button>
                </Flex>

                <Tabs
                    defaultActiveKey="1"
                    type="card"
                    size="large"
                    style={{ marginBottom: '16px' }}
                    items={[
                        {
                            key: '1',
                            label: <span style={{ fontSize: '15px', fontWeight: 600 }}><EditOutlined /> Modificar Usuario</span>,
                            children: renderPestañaModificar()
                        },
                        {
                            key: '2',
                            label: <span style={{ fontSize: '15px', fontWeight: 600 }}><UserAddOutlined /> Registrar Nuevo</span>,
                            children: renderPestañaAlta()
                        }
                    ]}
                />

                <Modal
                    title={
                        <Flex align="center" gap="10px" style={{ color: '#faad14' }}>
                            <ExclamationCircleOutlined style={{ fontSize: '22px' }} />
                            <span style={{ fontSize: '18px', fontWeight: 700 }}>¿Confirmar Modificación de Permisos?</span>
                        </Flex>
                    }
                    open={isConfirmModalOpen}
                    onOk={guardarCambiosConfirmados}
                    onCancel={() => setIsConfirmModalOpen(false)}
                    okText="Confirmar y Registrar"
                    cancelText="Volver a Revisar"
                    okButtonProps={{ style: { background: '#0958d9', height: '40px', fontWeight: 'bold' } }}
                    cancelButtonProps={{ style: { height: '40px' } }}
                    centered
                >
                    <Divider style={{ margin: '12px 0' }} />
                    <Text style={{ fontSize: '15px', display: 'block', marginBottom: '12px' }}>
                        Está a punto de alterar las credenciales del operador logueado bajo el usuario <Text strong>{valoresEditados?.username}</Text>.
                    </Text>
                    <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                        <Text style={{ display: 'block', fontSize: '15px', color: '#1e293b' }}>
                            • Operador:{" "}{valoresEditados?.apellido}, {valoresEditados?.nombre}
                        </Text>
                        <Text style={{ display: 'block', fontSize: '15px', marginTop: '6px', color: '#1e293b' }}>
                            • Rol:{" "}<span style={{ color: '#0958d9', fontWeight: 700 }}>
                                {valoresEditados?.rol?.includes('ADMIN') ? 'ADMINISTRADOR' : 'OPERADOR'}
                            </span>
                        </Text>
                    </div>
                    <Text type="secondary" style={{ fontSize: '12px', display: 'block', marginTop: '12px' }}>
                        Esta acción quedará registrada de forma permanente en el log histórico de auditoría de TI.
                    </Text>
                </Modal>

                <Modal
                    title={
                        <Flex align="center" gap="10px" style={{ color: '#ff4d4f' }}>
                            <ExclamationCircleOutlined style={{ fontSize: '22px' }} />
                            <span style={{ fontSize: '18px', fontWeight: 700 }}>¿Eliminar Usuario de Forma Permanente?</span>
                        </Flex>
                    }
                    open={isDeleteModalOpen}
                    onOk={ejecutarEliminacionDefinitiva}
                    onCancel={() => setIsDeleteModalOpen(false)}
                    okText="Eliminar Usuario"
                    cancelText="Cancelar Baja"
                    okButtonProps={{ danger: true, type: 'primary', style: { height: '40px', fontWeight: 'bold' } }}
                    cancelButtonProps={{ style: { height: '40px' } }}
                    centered
                >
                    <Divider style={{ margin: '12px 0' }} />
                    <Text style={{ fontSize: '15px', display: 'block', marginBottom: '12px' }}>
                        Atención: Está por eliminar definitivamente al operador <Text strong>{valoresEditados?.username}</Text> del sistema técnico.
                    </Text>
                    <div style={{ background: '#fff1f0', padding: '16px', borderRadius: '8px', border: '1px solid #ffa39e' }}>
                        <Text style={{ display: 'block', fontSize: '15px', color: '#a8071a' }}>
                            • Operador:{" "}{valoresEditados?.apellido}, {valoresEditados?.nombre}
                        </Text>
                        <Text style={{ display: 'block', fontSize: '15px', marginTop: '6px', color: '#a8071a' }}>
                            • Estado: El usuario perderá acceso inmediato a toda la plataforma.
                        </Text>
                    </div>
                    <Text type="secondary" style={{ fontSize: '12px', display: 'block', marginTop: '12px' }}>
                        Esta remoción forzará una entrada especial irreversible dentro de la auditoría de TI local.
                    </Text>
                </Modal>

            </div>
        </div>
    );
}