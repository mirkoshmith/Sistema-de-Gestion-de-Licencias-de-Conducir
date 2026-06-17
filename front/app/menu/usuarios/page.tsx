'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Form, Input, Select, Button, Card, Typography, Flex, Row, Col, Modal, Divider, message } from 'antd';
import { ArrowLeftOutlined, SaveOutlined, UserOutlined, SolutionOutlined, SafetyCertificateOutlined, ExclamationCircleOutlined } from '@ant-design/icons';

const { Option } = Select;
const { Title, Text } = Typography;

export default function EdicionUsuariosAdministrativos() {
    const router = useRouter();
    const [form] = Form.useForm();
    const [loading, setLoading] = useState<boolean>(false);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState<boolean>(false);
    const [valoresEditados, setValoresEditados] = useState<any | null>(null);

    const [apellidoSeleccionado, setApellidoSeleccionado] = useState<string | null>(null);

    // Datos simulados de los administrativos CAMBIAR
    const listaUsuariosMock = [
        { id: '1', legajo: 'L-45902', apellido: 'Rossi', nombre: 'Maximiliano', rol: 'ADMINISTRATIVO_SENIOR', email: 'm.rossi@santafe.gov.ar', centro: 'CENTRO_CENTRAL' },
        { id: '2', legajo: 'L-12345', apellido: 'Gomez', nombre: 'María Luz', rol: 'OPERADOR_MESA_ENTRADAS', email: 'ml.gomez@santafe.gov.ar', centro: 'DISTRITO_NORTE' },
        { id: '3', legajo: 'L-88844', apellido: 'Fernandez', nombre: 'Carlos', rol: 'AUDITOR_SISTEMAS', email: 'c.fernandez@santafe.gov.ar', centro: 'CENTRO_CENTRAL' }
    ];

    const manejarSeleccionApellido = (apellido: string) => {
        setApellidoSeleccionado(apellido);
        
        form.resetFields();
        setValoresEditados(null);
        
        form.setFieldsValue({ apellido: apellido });
        
        message.info(`Filtrando por apellido: ${apellido}. Proceda a elegir el nombre.`);
    };

    const manejarSeleccionNombre = (id: string) => {
        const usuario = listaUsuariosMock.find(u => u.id === id);
        if (usuario) {
            form.setFieldsValue(usuario); 
            setValoresEditados(usuario); 
            message.success(`Operador ${usuario.apellido}, ${usuario.nombre} seleccionado.`);
        }
    };

    const previsualizarCambios = (values: any) => {
        setValoresEditados(values);
        setIsConfirmModalOpen(true);
    };

    const guardarCambiosConfirmados = async () => {
        setIsConfirmModalOpen(false);
        setLoading(true);
        try {
            console.log('Enviando cambios confirmados al Backend:', valoresEditados);
            await new Promise((resolve) => setTimeout(resolve, 1500)); // Delay simulado
            message.success('¡Usuario administrativo actualizado con éxito!');
        } catch (error) {
            message.error('Error de red al intentar guardar los cambios.');
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
                                <span style={{ color: '#bfbfbf', fontWeight: 300, margin: '0 10px' }}>|</span>
                                <span style={{ color: '#262626', fontSize: '20px', fontWeight: 600, verticalAlign: 'middle' }}>
                                    Edición Controlada de Usuarios
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

                <Flex vertical gap="16px">

                    <Card variant="borderless" style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.05)', borderRadius: '12px' }}>
                        <Row gutter={16}>
                            <Col span={12}>
                                <div style={{ marginBottom: '12px' }}>
                                    <Text strong style={{ fontSize: '15px', color: '#475569' }}>1. Buscar por Apellido</Text>
                                </div>
                                <Select 
                                    showSearch 
                                    placeholder="Escriba el apellido (Ej: Rossi)..." 
                                    size="large" 
                                    style={{ width: '100%', height: '50px', fontSize: '15px' }}
                                    optionFilterProp="label" 
                                    onChange={manejarSeleccionApellido} 
                                    // Generamos una lista con apellidos únicos de tu mock
                                    options={Array.from(new Set(listaUsuariosMock.map(u => u.apellido))).map(ap => ({
                                        value: ap,
                                        label: ap
                                    }))}
                                />
                            </Col>

                            <Col span={12}>
                                <div style={{ marginBottom: '12px' }}>
                                    <Text strong style={{ fontSize: '15px', color: '#475569' }}>2. Seleccionar Nombre correspondiente</Text>
                                </div>
                                <Select 
                                    placeholder="Elija el nombre..." 
                                    size="large" 
                                    style={{ width: '100%', height: '50px', fontSize: '15px' }}
                                    disabled={!apellidoSeleccionado} // Sigue bloqueado hasta que elijas el apellido
                                    onChange={manejarSeleccionNombre} 
                                    // Sincroniza y fuerza a vaciarse visualmente si cambiás el apellido arriba
                                    value={valoresEditados ? valoresEditados.id : undefined}
                                    // Filtra la lista mostrando SOLO los nombres que compartan el apellido seleccionado
                                    options={listaUsuariosMock
                                        .filter(u => u.apellido === apellidoSeleccionado)
                                        .map(u => ({
                                            value: u.id,
                                            label: u.nombre
                                        }))}
                                />
                            </Col>
                        </Row>
                    </Card>

                    <Form form={form} layout="vertical" onFinish={previsualizarCambios}>
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
                                        icon={<SaveOutlined style={{ fontSize: '18px' }} />}
                                        style={{ background: '#0958d9', height: '54px', fontSize: '16px', fontWeight: 'bold', padding: '0 32px', borderRadius: '8px' }}
                                    >
                                        Guardar Cambios
                                    </Button>
                                </Flex>
                            ]}
                        >
                            <Row gutter={[20, 16]}>
                                <Col span={8}>
                                    <Form.Item name="legajo" label={<Text strong style={{ color: '#475569', fontSize: '14px' }}><SolutionOutlined /> Legajo Interno</Text>}>
                                        <Input size="large" disabled style={{ height: '48px', fontSize: '15px', background: '#f1f5f9', color: '#64748b', fontWeight: 'bold' }} />
                                    </Form.Item>
                                </Col>
                                
                                <Col span={8}>
                                    <Form.Item name="apellido" label={<Text strong style={{ color: '#475569', fontSize: '14px' }}><UserOutlined /> Apellido</Text>} rules={[{ required: true, message: 'El apellido es obligatorio.' }]}>
                                        <Input size="large" style={{ height: '48px', fontSize: '15px' }} />
                                    </Form.Item>
                                </Col>
                                
                                <Col span={8}>
                                    <Form.Item name="nombre" label={<Text strong style={{ color: '#475569', fontSize: '14px' }}><UserOutlined /> Nombre</Text>} rules={[{ required: true, message: 'El nombre es obligatorio.' }]}>
                                        <Input size="large" style={{ height: '48px', fontSize: '15px' }} />
                                    </Form.Item>
                                </Col>

                                <Col span={12}>
                                    <Form.Item name="email" label={<Text strong style={{ color: '#475569', fontSize: '14px' }}>Correo Electrónico Institucional</Text>} rules={[{ required: true, type: 'email', message: 'Ingrese un mail válido.' }]}>
                                        <Input size="large" style={{ height: '48px', fontSize: '15px' }} />
                                    </Form.Item>
                                </Col>

                                <Col span={12}>
                                    <Form.Item name="rol" label={<Text strong style={{ color: '#475569', fontSize: '14px' }}><SafetyCertificateOutlined /> Rol y Permisos de Sistema</Text>} rules={[{ required: true }]}>
                                        <Select size="large" style={{ height: '48px', fontSize: '15px' }}>
                                            <Option value="ADMINISTRATIVO_SENIOR">Administrativo Senior</Option>
                                            <Option value="OPERADOR_MESA_ENTRADAS">Operador Mesa de Entradas</Option>
                                            <Option value="AUDITOR_SISTEMAS">Auditor de Sistemas</Option>
                                        </Select>
                                    </Form.Item>
                                </Col>

                                <Col span={24}>
                                    <Form.Item name="centro" label={<Text strong style={{ color: '#475569', fontSize: '14px' }}>Centro de Emisión Asignado</Text>} rules={[{ required: true }]}>
                                        <Select size="large" style={{ height: '48px', fontSize: '15px' }}>
                                            <Option value="CENTRO_CENTRAL">Centro Emisión Central — Santa Fe</Option>
                                            <Option value="DISTRITO_NORTE">Distrito Municipal Norte</Option>
                                            <Option value="DISTRITO_ESTE">Distrito Municipal Este</Option>
                                        </Select>
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Card>
                    </Form>
                </Flex>

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
                        Está a punto de alterar las credenciales del operador logueado bajo el legajo <Text strong>{valoresEditados?.legajo}</Text>.
                    </Text>
                    <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                        <Text style={{ display: 'block', fontSize: '15px', color: '#1e293b' }}>
                            • Operador:{" "}{valoresEditados?.apellido}, {valoresEditados?.nombre}
                        </Text>
                        <Text style={{ display: 'block', fontSize: '15px', marginTop: '6px', color: '#1e293b' }}>
                            • Nuevo Rol:{" "}<span style={{color: '#0958d9', fontWeight: 700 }}>{valoresEditados?.rol?.replace('_', ' ')}</span>
                        </Text>
                        <Text style={{ display: 'block', fontSize: '15px', marginTop: '6px', color: '#1e293b' }}>
                            • Destino:{" "}{valoresEditados?.centro?.replace('_', ' ')}
                        </Text>
                    </div>
                    <Text type="secondary" style={{ fontSize: '12px', display: 'block', marginTop: '12px' }}>
                        Esta acción quedará registrada de forma permanente en el log histórico de auditoría.
                    </Text>
                </Modal>

            </div>
        </div>
    );
}