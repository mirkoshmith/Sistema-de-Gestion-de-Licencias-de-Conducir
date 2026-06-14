'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Form, Input, Select, Button, Card, Table, Tag, Typography, Flex, Row, Col, Space } from 'antd';
import { SearchOutlined, ArrowLeftOutlined, ClearOutlined, EyeOutlined, FilterOutlined } from '@ant-design/icons';

const { Option } = Select;
const { Title, Text } = Typography;

export default function BuscarLicenciasAdministrativo() {
    const router = useRouter();
    const [form] = Form.useForm();
    const [loading, setLoading] = useState<boolean>(false);
    
    // Estado para guardar la lista de resultados devuelta por Spring Boot
    const [resultados, setResultados] = useState<any[]>([]);

    // Datos simulados (Mock Data) para probar la visualización instantánea
    const datosDePrueba = [
        { key: '1', nroDoc: '12345678', apellido: 'Rossi', nombre: 'Juan Ignacio', clase: 'B', vigencia: '15/05/2029', estado: 'VIGENTE' },
        { key: '2', nroDoc: '23456789', apellido: 'Gomez', nombre: 'María Luz', clase: 'A', vigencia: '22/02/2025', estado: 'EXPIRADA' },
        { key: '3', nroDoc: '34567890', apellido: 'Fernandez', nombre: 'Carlos', clase: 'C', vigencia: '10/11/2028', estado: 'VIGENTE' },
        { key: '4', nroDoc: '45678901', apellido: 'Lopez', nombre: 'Ana Clara', clase: 'D', vigencia: '04/01/2026', estado: 'EXPIRADA' },
    ];

    // 1. Manejo de la combinación de filtros contra el Backend
    const manejarBusqueda = async (values: any) => {
        setLoading(true);
        try {
            console.log('📡 Enviando combinación de filtros al Backend:', values);
            // Acá meterías tu fetch con Query Params: 
            // fetch(`http://localhost:8080/api/licencias/buscar?dni=${values.dni}&apellido=${values.apellido}&estado=${values.estado}`)
            
            await new Promise((resolve) => setTimeout(resolve, 1000)); // Delay simulado

            // Filtrado lógico simulado para el TP en base a lo que ingrese el usuario
            let filtrados = datosDePrueba;
            if (values.dni) filtrados = filtrados.filter(item => item.nroDoc.includes(values.dni));
            if (values.apellido) filtrados = filtrados.filter(item => item.apellido.toLowerCase().includes(values.apellido.toLowerCase()));
            if (values.estado) filtrados = filtrados.filter(item => item.estado === values.estado);
            if (values.clase) filtrados = filtrados.filter(item => item.clase === values.clase);

            setResultados(filtrados);
        } catch (error) {
            console.error('Error al conectar con Spring Boot:', error);
        } finally {
            setLoading(false);
        }
    };

    const limpiarFiltros = () => {
        form.resetFields();
        setResultados([]);
    };

    // 2. Definición de Columnas de la Tabla (Maximizando el contraste y tamaño de letra)
    const columns = [
        {
            title: 'Documento',
            dataIndex: 'nroDoc',
            key: 'nroDoc',
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
            dataIndex: 'vigencia',
            key: 'vigencia',
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
        }
    ];

    return (
        <div style={{ background: '#f5f7fa', height: '100vh', maxHeight: '100vh', overflow: 'hidden', padding: '30px 24px' }}>
            <div style={{ maxWidth: 1050, margin: '0 auto' }}>
                
                {/* CABECERA OPERATIVA DE ACCESIBILIDAD MACRO */}
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
                    
                    {/* PANEL DE CONTROL: COMBINACIÓN DE FILTROS AGRANDADOS */}
                    <Card variant="borderless" style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.05)', borderRadius: '12px' }}>
                        <Form form={form} layout="vertical" onFinish={manejarBusqueda}>
                            <Row gutter={[16, 0]} align="bottom">
                                <Col span={6}>
                                    <Form.Item name="dni" label={<Text strong style={{ color: '#475569', fontSize: '14px' }}>Nro. Documento</Text>} style={{ margin: 0 }}>
                                        <Input placeholder="Ej: 12345678" style={{ height: '48px', fontSize: '15px' }} />
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
                                        </Select>
                                    </Form.Item>
                                </Col>
                                <Col span={3}>
                                    <Form.Item name="clase" label={<Text strong style={{ color: '#475569', fontSize: '14px' }}>Clase</Text>} style={{ margin: 0 }}>
                                        <Select placeholder="Todas" size="large" style={{ height: '48px', fontSize: '15px' }}>
                                            {['A', 'B', 'C', 'D', 'E', 'G'].map(c => <Option key={c} value={c}>{c}</Option>)}
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
                                            style={{ background: '#fa8c16', height: '48px', fontWeight: 'bold', flexGrow: 1, fontSize: '14px', borderRadius: '6px' }}
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

                    {/* VISTA DE RESULTADOS: TABLA DE ALTO CONTRASTE */}
                    <Card variant="borderless" style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.05)', borderRadius: '12px', padding: '4px' }}>
                        <Table 
                            dataSource={resultados} 
                            columns={columns} 
                            loading={loading}
                            pagination={{ pageSize: 5 }}
                            locale={{ emptyText: 'No se han aplicado filtros o no hay registros coincidentes.' }}
                            style={{ fontSize: '16px' }}
                        />
                    </Card>

                </Flex>

            </div>
        </div>
    );
}