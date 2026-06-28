'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Form, Input, Select, Button, Card, Table, Tag, Typography, Flex, Row, Col, Modal, Radio, Divider, Space, message } from 'antd';
import { SearchOutlined, ArrowLeftOutlined, ClearOutlined, EditOutlined, ExclamationCircleOutlined, HomeOutlined } from '@ant-design/icons';

const { Option } = Select;
const { Title, Text } = Typography;

export default function BuscarLicenciasAdministrativo() {
    const router = useRouter();
    const [form] = Form.useForm();
    const [formEdicion] = Form.useForm();
    const [loading, setLoading] = useState<boolean>(false);
    const [guardando, setGuardando] = useState<boolean>(false);

    const [resultados, setResultados] = useState<any[]>([]);

    const [isEditModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
    const [titularSeleccionado, setTitularSeleccionado] = useState<any | null>(null);

    const usuarioStr = typeof window !== 'undefined' ? sessionStorage.getItem("usuario") : null;
    const usuarioLogueado = usuarioStr ? JSON.parse(usuarioStr) : {};

    const manejarBusqueda = async (values: any) => {
        setLoading(true);
        try {
            const claseFiltrada = values.clase === '-' ? '' : values.clase;
            const response = await fetch(`http://localhost:8080/api/licencias/buscar?nroDocumento=${values.nroDocumento}&apellido=${values.apellido}&estado=${values.estado}&clase=${claseFiltrada}`);
            setResultados(await response.json());
        } catch (error) {
            console.error('Error al conectar con Spring Boot:', error);
            message.error('Error de red al intentar buscar licencias.');
        } finally {
            setLoading(false);
        }
    };

    const limpiarFiltros = () => {
        form.resetFields();
        setResultados([]);
    };

    const abrirEdicionTitular = (record: any) => {
        setTitularSeleccionado(record);
        setIsDeleteModalOpen(true);
        
        formEdicion.setFieldsValue({
            direccion: record.direccion,
            grupoSanguineo: record.grupoSanguineo && record.factorRh ? `${record.grupoSanguineo}${record.factorRh === 'POSITIVO' ? '+' : '-'}` : undefined,
            donante: record.donante ? 'SI' : 'NO'
        });
    };

    const guardarCambiosTitular = async (values: any) => {
        setGuardando(true);
        try {
            const strSangre = values.grupoSanguineo;
            const grupo = strSangre.slice(0, -1);
            const factorSigno = strSangre.slice(-1);
            const factorEnum = factorSigno === '+' ? 'POSITIVO' : 'NEGATIVO';

            const payload = {
                direccion: values.direccion,
                grupoSanguineo: grupo, 
                donante: values.donante === 'SI',
                idUsuarioAdministrador: usuarioLogueado.id || 1 
            };

            const idTitular = titularSeleccionado.idTitular || titularSeleccionado.id;

            const response = await fetch(`http://localhost:8080/api/titulares/modificar/${idTitular}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const respuestaTexto = await response.text();

            if (response.ok) {
                message.success(respuestaTexto || 'Datos del titular actualizados correctamente.');
                setIsDeleteModalOpen(false);
                setTitularSeleccionado(null);
                formEdicion.resetFields();
                
                form.submit();
            } else {
                message.error(respuestaTexto || 'Error al intentar actualizar el titular.');
            }
        } catch (error) {
            console.error('Error al actualizar titular:', error);
            message.error('No se pudo conectar con el servidor para modificar el titular.');
        } finally {
            setGuardando(false);
        }
    };

    const columns = [
        {
            title: 'Documento',
            dataIndex: 'nroDocumentoTitular',
            key: 'nroDocumentoTitular',
            render: (text: string) => <Text strong style={{ fontSize: '15px' }}>{text}</Text>,
        },
        {
            title: 'Apellido',
            dataIndex: 'apellido',
            key: 'apellido',
            render: (text: string) => <Text style={{ fontSize: '15px' }}>{text}</Text>,
        },
        {
            title: 'Nombre',
            dataIndex: 'nombre',
            key: 'nombre',
            render: (text: string) => <Text style={{ fontSize: '15px' }}>{text}</Text>,
        },
        {
            title: 'Clase',
            dataIndex: 'clase',
            key: 'clase',
            align: 'center' as const,
            render: (clase: string) => <Tag color="blue" style={{ fontSize: '14px', fontWeight: 'bold', padding: '4px 10px' }}>{clase}</Tag>,
        },
        {
            title: 'Vencimiento',
            dataIndex: 'fechaVencimiento',
            key: 'fechaVencimiento',
            render: (text: string) => <Text style={{ fontSize: '15px' }}>{text}</Text>,
        },
        {
            title: 'Estado',
            dataIndex: 'estado',
            key: 'estado',
            align: 'center' as const,
            render: (estado: string) => {
                const esVigente = estado === 'VIGENTE';
                return (
                    <Tag color={esVigente ? 'success' : 'error'} style={{ fontSize: '13px', fontWeight: 'bold', padding: '4px 12px', borderRadius: '4px' }}>
                        {estado}
                    </Tag>
                );
            },
        },
        {
            title: 'Acciones',
            key: 'acciones',
            align: 'center' as const,
            render: (_: any, record: any) => (
                <Button
                    type="primary"
                    ghost
                    icon={<EditOutlined />}
                    onClick={() => abrirEdicionTitular(record)}
                    style={{ fontSize: '14px', fontWeight: '600', height: '36px', borderRadius: '4px' }}
                >
                    Editar
                </Button>
            ),
        }
    ];

    return (
        <div style={{ background: '#f5f7fa', height: '100vh', maxHeight: '100vh', overflow: 'hidden', padding: '30px 24px' }}>
            <div style={{ maxWidth: 1050, margin: '0 auto' }}>

                <Flex align="center" justify="space-between" style={{ marginBottom: '24px' }}>
                    <Flex align="center" gap="14px">
                        <div style={{ width: '5px', height: '38px', backgroundColor: '#fa8c16', borderRadius: '3px' }} />
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <Title level={2} style={{ margin: 0, fontWeight: 800, letterSpacing: '-0.02em', fontSize: '26px' }}>
                                <span style={{ color: '#8c8c8c', fontWeight: 400 }}>Región</span>{' '}
                                <span style={{ background: 'linear-gradient(45deg, #141414, #fa8c16)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                                    Santa Fe
                                </span>
                                <span style={{ color: '#bfbfbf', fontWeight: 300, margin: '0 10px' }}>|</span>
                                <span style={{ color: '#262626', fontSize: '20px', fontWeight: 600, verticalAlign: 'middle' }}>
                                    Consulta General de Licencias
                                </span>
                            </Title>
                        </div>
                    </Flex>
                    <Button
                        type="text"
                        icon={<ArrowLeftOutlined style={{ fontSize: '16px' }} />}
                        onClick={() => router.push('/menu')}
                        style={{ display: 'flex', alignItems: 'center', fontWeight: 600, color: '#475569', fontSize: '15px', height: '40px' }}
                    >
                        Volver al Menú
                    </Button>
                </Flex>

                <Flex vertical gap="16px">

                    <Card variant="borderless" style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.05)', borderRadius: '12px' }}>
                        <Form
                            form={form}
                            layout="vertical"
                            onFinish={manejarBusqueda}
                            initialValues={{
                                nroDocumento: "",
                                apellido: "",
                                estado: "",
                                clase: "-"
                            }}
                        >
                            <Row gutter={[16, 0]} align="bottom">
                                <Col span={6}>
                                    <Form.Item name="nroDocumento" label={<Text strong style={{ color: '#475569', fontSize: '14px' }}>Nro. Documento</Text>} style={{ margin: 0 }}>
                                        <Input placeholder="Ej: 45123456" style={{ height: '48px', fontSize: '15px' }} />
                                    </Form.Item>
                                </Col>
                                <Col span={6}>
                                    <Form.Item name="apellido" label={<Text strong style={{ color: '#475569', fontSize: '14px' }}>Apellido del Titular</Text>} style={{ margin: 0 }}>
                                        <Input placeholder="Ej: Rossi" style={{ height: '48px', fontSize: '15px' }} />
                                    </Form.Item>
                                </Col>
                                <Col span={5}>
                                    <Form.Item name="estado" label={<Text strong style={{ color: '#475569', fontSize: '14px' }}>Estado Administrativo</Text>} style={{ margin: 0 }}>
                                        <Select placeholder="Todos" size="large" style={{ height: '48px', fontSize: '15px' }}>
                                            <Option value="VIGENTE">Vigentes</Option>
                                            <Option value="EXPIRADA">Expiradas (Vencidas)</Option>
                                            <Option value=""> - </Option>
                                        </Select>
                                    </Form.Item>
                                </Col>
                                <Col span={3}>
                                    <Form.Item name="clase" label={<Text strong style={{ color: '#475569', fontSize: '14px' }}>Clase</Text>} style={{ margin: 0 }}>
                                        <Select placeholder="Todas" size="large" style={{ height: '48px', fontSize: '15px' }}>
                                            {['A', 'B', 'C', 'D', 'E', 'G', '-'].map(c => <Option key={c} value={c}>{c}</Option>)}
                                        </Select>
                                    </Form.Item>
                                </Col>
                                <Col span={4}>
                                    <Flex gap="8px">
                                        <Button
                                            type="primary"
                                            htmlType="submit"
                                            loading={loading}
                                            icon={<SearchOutlined />}
                                            style={{ background: '#fa8c16', borderColor: '#fa8c16', height: '48px', fontWeight: 'bold', flexGrow: 1, fontSize: '14px', borderRadius: '6px' }}
                                        >
                                            Filtrar
                                        </Button>
                                        <Button
                                            type="default"
                                            onClick={limpiarFiltros}
                                            icon={<ClearOutlined />}
                                            style={{ height: '48px', width: '48px', borderRadius: '6px' }}
                                        />
                                    </Flex>
                                </Col>
                            </Row>
                        </Form>
                    </Card>

                    <Card variant="borderless" style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.05)', borderRadius: '12px', padding: '4px' }}>
                        <Table
                            dataSource={resultados}
                            columns={columns}
                            loading={loading}
                            rowKey="id"
                            pagination={{ pageSize: 5 }}
                            locale={{ emptyText: 'No se han aplicado filtros o no hay registros coincidentes.' }}
                            style={{ fontSize: '16px' }}
                        />
                    </Card>

                </Flex>

                <Modal
                    title={
                        <Flex align="center" gap="10px" style={{ color: '#fa8c16' }}>
                            <ExclamationCircleOutlined style={{ fontSize: '22px' }} />
                            <span style={{ fontSize: '18px', fontWeight: 700 }}>Modificar Datos del Contribuyente</span>
                        </Flex>
                    }
                    open={isEditModalOpen}
                    onCancel={() => {
                        setIsDeleteModalOpen(false);
                        setTitularSeleccionado(null);
                        formEdicion.resetFields();
                    }}
                    footer={null}
                    centered
                    width={650}
                >
                    <Divider style={{ margin: '12px 0' }} />
                    <div style={{ marginBottom: '20px' }}>
                        <Text style={{ fontSize: '15px' }}>
                            Editando los datos del Titular: <Text strong style={{ fontSize: '16px' }}>{titularSeleccionado?.apellido}, {titularSeleccionado?.nombre}</Text> (DNI: {titularSeleccionado?.nroDocumentoTitular})
                        </Text>
                    </div>

                    <Form form={formEdicion} layout="vertical" onFinish={guardarCambiosTitular}>
                        <Row gutter={[16, 12]}>
                            <Col span={24}>
                                <Form.Item 
                                    name="direccion" 
                                    label={<Text strong style={{ color: '#475569', fontSize: '14px' }}>Domicilio Residencial Actualizado</Text>}
                                    rules={[{ required: true, message: 'La dirección es obligatoria.', whitespace: true }]}
                                >
                                    <Space.Compact style={{ width: '100%' }} size="large">
                                        <Button 
                                            icon={<HomeOutlined />} 
                                            disabled 
                                            style={{ background: '#f5f5f5', color: '#8c8c8c', height: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center' }} 
                                        />
                                        <Input placeholder="Ej: Alvear 3400, Santa Fe" style={{ height: '44px' }} />
                                    </Space.Compact>
                                </Form.Item>
                            </Col>

                            <Col span={12}>
                                <Form.Item 
                                    name="grupoSanguineo" 
                                    label={<Text strong style={{ color: '#475569', fontSize: '14px' }}>Grupo y Factor Sanguíneo</Text>}
                                    rules={[{ required: true, message: 'Seleccione la combinación de salud.' }]}
                                >
                                    <Select size="large" placeholder="Seleccionar factor" style={{ width: '100%' }}>
                                        {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(g => (
                                            <Option key={g} value={g}>Factor {g}</Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                            </Col>

                            <Col span={12}>
                                <Form.Item 
                                    name="donante" 
                                    label={<Text strong style={{ color: '#475569', fontSize: '14px' }}>Condición de Donante (Ley de Trasplantes)</Text>}
                                >
                                    <Radio.Group buttonStyle="solid" size="large" style={{ width: '100%', display: 'flex' }}>
                                        <Radio.Button value="SI" style={{ flexGrow: 1, textAlign: 'center' }}>SÍ</Radio.Button>
                                        <Radio.Button value="NO" style={{ flexGrow: 1, textAlign: 'center' }}>NO</Radio.Button>
                                    </Radio.Group>
                                </Form.Item>
                            </Col>
                        </Row>

                        <Divider style={{ margin: '20px 0 14px 0' }} />
                        
                        <Flex justify="end" gap="12px">
                            <Button 
                                onClick={() => {
                                    setIsDeleteModalOpen(false);
                                    setTitularSeleccionado(null);
                                    formEdicion.resetFields();
                                }}
                                style={{ height: '44px', borderRadius: '6px', fontWeight: 600 }}
                            >
                                Cancelar
                            </Button>
                            <Button 
                                type="primary" 
                                htmlType="submit" 
                                loading={guardando}
                                style={{ background: '#fa8c16', borderColor: '#fa8c16', height: '44px', fontWeight: 'bold', minWidth: '140px', borderRadius: '6px' }}
                            >
                                Guardar Cambios
                            </Button>
                        </Flex>
                    </Form>
                </Modal>

            </div>
        </div>
    );
}