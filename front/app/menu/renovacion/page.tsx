'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Form, Input, Select, Button, Card, Row, Col, Typography, Flex, Divider, Modal, Steps, Statistic, Tag, Descriptions, message } from 'antd';
import { SearchOutlined, ArrowLeftOutlined, SaveOutlined, IdcardOutlined, DollarOutlined, ExclamationCircleOutlined, FormOutlined, CheckCircleOutlined } from '@ant-design/icons';

const { Option } = Select;
const { Title, Text } = Typography;

export default function RenovacionLicencia() {
    const router = useRouter();
    const [form] = Form.useForm();
    const [currentStep, setCurrentStep] = useState<number>(0);
    const [loadingBusqueda, setLoadingBusqueda] = useState<boolean>(false);
    const [loadingRenovacion, setLoadingRenovacion] = useState<boolean>(false);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState<boolean>(false);
    
    const [datosTitular, setDatosTitular] = useState<any | null>(null);
    const [valoresFinales, setValoresFinales] = useState<any | null>(null);

    const COSTO_RENOVACION = 4800.00;
    const NUEVA_VIGENCIA = "17/06/2031";

    const manejarBusqueda = async (values: { documento: string }) => {
        setLoadingBusqueda(true);
        try {
            await new Promise((resolve) => setTimeout(resolve, 1100));

            if (values.documento === '12345678' || values.documento.length > 6) {
                const datosMock = {
                    titular: 'JUAN IGNACIO ROSSI',
                    dni: values.documento,
                    claseSolicitada: 'B',
                    fechaVencimientoAnterior: '15/05/2026',
                    grupoSanguineo: 'O+',
                    donante: 'SÍ'
                };
                setDatosTitular(datosMock);
                form.setFieldsValue({ motivo: 'VENCIMIENTO_CRONOLOGICO' });
                message.success('Registro de titular localizado.');
                setCurrentStep(1);
            } else {
                setDatosTitular(null);
                message.warning('No se encontraron licencias susceptibles de renovación para ese documento.');
            }
        } catch (error) {
            message.error('Error al conectar con el servidor de Spring Boot.');
        } finally {
            setLoadingBusqueda(false);
        }
    };

    const previsualizarRenovacion = (values: any) => {
        setValoresFinales({
            ...values,
            ...datosTitular,
            costo: COSTO_RENOVACION,
            nuevaVigencia: NUEVA_VIGENCIA
        });
        setIsConfirmModalOpen(true);
    };

    const guardarRenovacionConfirmada = async () => {
        setIsConfirmModalOpen(false);
        setLoadingRenovacion(true);
        try {
            await new Promise((resolve) => setTimeout(resolve, 1500));
            message.success('¡Renovación de licencia registrada y auditada con éxito!');
            setCurrentStep(2);
        } catch (error) {
            message.error('No se pudo procesar la renovación en la base de datos.');
        } finally {
            setLoadingRenovacion(false);
        }
    };

    const reiniciarTramite = () => {
        form.resetFields();
        setDatosTitular(null);
        setValoresFinales(null);
        setCurrentStep(0);
    };

    return (
        <div style={{ background: '#f5f7fa', height: '100vh', maxHeight: '100vh', overflow: 'hidden', padding: '30px 24px' }}>
            <div style={{ maxWidth: 950, margin: '0 auto' }}>
                
                <Flex align="center" justify="space-between" style={{ marginBottom: '24px' }}>
                    <Flex align="center" gap="14px">
                        <div style={{ width: '5px', height: '38px', backgroundColor: '#1677ff', borderRadius: '3px' }} />
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <Title level={2} style={{ margin: 0, fontWeight: 800, letterSpacing: '-0.02em', fontSize: '26px' }}>
                                <span style={{ color: '#8c8c8c', fontWeight: 400 }}>Región</span>{' '}
                                <span style={{ background: 'linear-gradient(45deg, #141414, #1677ff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                                    Santa Fe
                                </span>
                                <span style={{ color: '#bfbfbf', fontWeight: 300, margin: '0 10px' }}>|</span>
                                <span style={{ color: '#262626', fontSize: '20px', fontWeight: 600, verticalAlign: 'middle' }}>
                                    Proceso de Renovación Operativo
                                </span>
                            </Title>
                        </div>
                    </Flex>
                    <Button 
                        type="text" 
                        icon={<ArrowLeftOutlined style={{ fontSize: '16px' }} />} 
                        onClick={() => router.push('/menu')}
                        disabled={currentStep === 1 || loadingRenovacion}
                        style={{ display: 'flex', alignItems: 'center', fontWeight: 600, color: '#475569', fontSize: '15px', height: '40px' }}
                    >
                        Volver al Menú
                    </Button>
                </Flex>

                <Steps 
                    current={currentStep} 
                    style={{ marginBottom: '28px', padding: '0 10px' }}
                    items={[
                        { title: <span style={{ fontSize: '15px', fontWeight: 500 }}>Localizar Titular</span> },
                        { title: <span style={{ fontSize: '15px', fontWeight: 500 }}>Liquidar Renovación</span> },
                        { title: <span style={{ fontSize: '15px', fontWeight: 500 }}>Finalizado</span> },
                    ]}
                />

                <Flex vertical gap="16px">

                    {currentStep === 0 && (
                        <Card variant="borderless" style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.05)', borderRadius: '12px', padding: '8px' }}>
                            <div style={{ marginBottom: '20px' }}>
                                <Text strong style={{ fontSize: '18px', color: '#1e293b', display: 'block' }}>Iniciar Trámite de Renovación</Text>
                                <Text type="secondary" style={{ fontSize: '14px', display: 'block', marginTop: '6px' }}>Ingrese el DNI del contribuyente para cargar su historial actual y verificar inhabilitaciones vigentes.</Text>
                            </div>
                            <Form form={form} layout="inline" onFinish={manejarBusqueda} style={{ alignItems: 'flex-start' }}>
                                <Form.Item 
                                    name="documento" 
                                    rules={[{ required: true, message: 'Falta el documento.' }, { pattern: /^[0-9]+$/, message: 'Solo números.' }]}
                                    style={{ flexGrow: 1, marginRight: '16px' }}
                                >
                                    <Input 
                                        size="large" 
                                        prefix={<SearchOutlined style={{ fontSize: '18px', color: '#94a3b8' }} />} 
                                        placeholder="Número de DNI sin puntos (Ej: 12345678)" 
                                        maxLength={8} 
                                        style={{ height: '54px', fontSize: '16px', borderRadius: '8px' }}
                                    />
                                </Form.Item>
                                <Form.Item style={{ marginRight: 0 }}>
                                    <Button 
                                        type="primary" 
                                        htmlType="submit" 
                                        size="large" 
                                        loading={loadingBusqueda} 
                                        style={{ background: '#1677ff', height: '54px', fontSize: '16px', fontWeight: 'bold', padding: '0 24px', borderRadius: '8px' }}
                                    >
                                        Buscar Historial
                                    </Button>
                                </Form.Item>
                            </Form>
                        </Card>
                    )}

                    {currentStep === 1 && datosTitular && (
                        <Form form={form} layout="vertical" onFinish={previsualizarRenovacion}>
                            <Row gutter={20}>
                                <Col span={14}>
                                    <Card 
                                        variant="borderless" 
                                        title={<span style={{ fontSize: '17px', fontWeight: 700 }}><IdcardOutlined style={{ marginRight: 8, color: '#1677ff' }} /> Datos Actuales del Contribuyente</span>}
                                        style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.05)', borderRadius: '12px' }}
                                    >
                                        <Descriptions 
                                            column={2} 
                                            bordered 
                                            size="middle" 
                                            layout="vertical" 
                                            styles={{
                                                label: { fontSize: '14px', fontWeight: 600, background: '#f8fafc', color: '#475569' },
                                                content: { fontSize: '15px', color: '#1e293b', fontWeight: 500 }
                                            }}
                                        >
                                            <Descriptions.Item label="Titular Afiliado" span={2}>
                                                <Text strong style={{ color: '#1e293b', fontSize: '18px' }}>{datosTitular.titular}</Text>
                                            </Descriptions.Item>
                                            <Descriptions.Item label="Documento N°"><Text style={{ fontSize: '16px', fontWeight: 600 }}>{datosTitular.dni}</Text></Descriptions.Item>
                                            <Descriptions.Item label="Clase Actual"><Tag color="blue" style={{ fontSize: '13px', fontWeight: 'bold', padding: '4px 10px' }}>Clase {datosTitular.claseSolicitada}</Tag></Descriptions.Item>
                                            <Descriptions.Item label="Vencimiento Anterior" span={2}><Text delete type="danger" style={{ fontSize: '15px' }}>{datosTitular.fechaVencimientoAnterior}</Text></Descriptions.Item>
                                        </Descriptions>

                                        <Divider style={{ margin: '20px 0 16px 0' }} />

                                        <Form.Item 
                                            name="motivo" 
                                            label={<Text strong style={{ color: '#475569', fontSize: '15px' }}><FormOutlined /> Motivo Legal del Trámite</Text>} 
                                            rules={[{ required: true }]}
                                        >
                                            <Select size="large" style={{ height: '48px', fontSize: '15px' }}>
                                                <Option value="VENCIMIENTO_CRONOLOGICO">Renovación por Vencimiento Estándar</Option>
                                                <Option value="CAMBIO_DATOS">Renovación por Cambio de Datos / Domicilio</Option>
                                                <Option value="DETERIORO_FISICO/EXTRAVÍO">Renovación por Deterioro/Extravío de la Licencia Original</Option>
                                            </Select>
                                        </Form.Item>
                                    </Card>
                                </Col>

                                <Col span={10}>
                                    <Card 
                                        variant="borderless" 
                                        title={<span style={{ fontSize: '17px', fontWeight: 700 }}><DollarOutlined style={{ marginRight: 8, color: '#52c41a' }} /> Nueva Liquidación</span>}
                                        style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.05)', borderRadius: '12px', height: '100%' }}
                                    >
                                        <Flex vertical justify="space-between" style={{ height: '100%', minHeight: '320px' }}>
                                            <Flex vertical gap="18px">
                                                <div>
                                                    <Statistic 
                                                        title={<span style={{ fontSize: '14px', color: '#64748b', fontWeight: 500 }}>Nueva Vigencia Calculada</span>} 
                                                        value={NUEVA_VIGENCIA}
                                                        formatter={(value) => <Text style={{ color: '#52c41a', fontWeight: 800, fontSize: '24px' }}>{value}</Text>}
                                                    />
                                                    <Text type="secondary" style={{ fontSize: '13px', display: 'block', marginTop: '4px' }}>Calculado según edad y clase solicitada.</Text>
                                                </div>
                                                <Divider style={{ margin: '4px 0' }} />
                                                <div>
                                                    <Statistic 
                                                        title={<span style={{ fontSize: '14px', color: '#64748b', fontWeight: 500 }}>Costo Total Arancel de Renovación</span>} 
                                                        value={COSTO_RENOVACION} 
                                                        precision={2} 
                                                        prefix="$" 
                                                        styles={{ content: { color: '#0f172a', fontWeight: 900, fontSize: '38px' } }} 
                                                    />
                                                </div>
                                            </Flex>
                                            
                                            <Flex vertical gap="10px">
                                                <Button 
                                                    type="primary" 
                                                    htmlType="submit"
                                                    size="large" 
                                                    block 
                                                    style={{ background: '#1677ff', height: '54px', fontSize: '16px', fontWeight: 'bold', borderRadius: '8px' }}
                                                >
                                                    Solicitar Renovación
                                                </Button>
                                                <Button type="text" danger block onClick={reiniciarTramite} style={{ fontSize: '14px', fontWeight: 600 }}>
                                                    Cancelar
                                                </Button>
                                            </Flex>
                                        </Flex>
                                    </Card>
                                </Col>
                            </Row>
                        </Form>
                    )}

                    {currentStep === 2 && (
                        <Card variant="borderless" style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.05)', borderRadius: '12px', textAlign: 'center', padding: '40px 20px' }}>
                            <CheckCircleOutlined style={{ fontSize: '72px', color: '#52c41a', marginBottom: '20px' }} />
                            <Title level={3} style={{ margin: '0 0 12px 0', fontWeight: 800 }}>¡Licencia Renovada Exitosamente!</Title>
                            <Text type="secondary" style={{ maxWidth: '600px', margin: '0 auto 28px auto', display: 'block', fontSize: '15px', lineHeight: '1.5' }}>
                                El trámite impactó de forma conforme en la base de datos de auditoría. Se extendió la vigencia para el contribuyente <Text strong style={{ color: '#0f172a' }}>{datosTitular?.titular}</Text> hasta el día <Text strong style={{ color: '#52c41a' }}>{NUEVA_VIGENCIA}</Text>.
                            </Text>
                            <Flex justify="center" gap="large">
                                <Button type="primary" onClick={reiniciarTramite} style={{ background: '#1677ff', height: '50px', fontSize: '15px', fontWeight: 'bold', padding: '0 24px', borderRadius: '8px' }}>
                                    Iniciar Nuevo Trámite
                                </Button>
                                <Button type="dashed" onClick={() => router.push('/menu')} style={{ height: '50px', fontSize: '15px', fontWeight: '500', padding: '0 24px', borderRadius: '8px' }}>
                                    Volver al Menú Principal
                                </Button>
                            </Flex>
                        </Card>
                    )}

                </Flex>

                <Modal
                    title={
                        <Flex align="center" gap="10px" style={{ color: '#faad14' }}>
                            <ExclamationCircleOutlined style={{ fontSize: '22px' }} />
                            <span style={{ fontSize: '18px', fontWeight: 700 }}>¿Confirmar Registro de Renovación?</span>
                        </Flex>
                    }
                    open={isConfirmModalOpen}
                    onOk={guardarRenovacionConfirmada}
                    onCancel={() => setIsConfirmModalOpen(false)}
                    okText="Confirmar y Persistir"
                    cancelText="Modificar Datos"
                    okButtonProps={{ style: { background: '#1677ff', height: '40px', fontWeight: 'bold' }, loading: loadingRenovacion }}
                    cancelButtonProps={{ style: { height: '40px' }, disabled: loadingRenovacion }}
                    centered
                >
                    <Divider style={{ margin: '12px 0' }} />
                    <Text style={{ fontSize: '15px', display: 'block', marginBottom: '12px' }}>
                        Está a punto de asentar una extensión de vigencia legal para el conductor:
                    </Text>
                    <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                        <Text style={{ display: 'block', fontSize: '15px', color: '#1e293b' }}>
                            • Conductor: {" "}{valoresFinales?.titular}
                        </Text>
                        <Text style={{ display: 'block', fontSize: '15px', marginTop: '6px', color: '#1e293b' }}>
                            • Nueva Fecha Límite: {" "}<span style={{ color: '#52c41a', fontWeight: 700 }}>{valoresFinales?.nuevaVigencia}</span>
                        </Text>
                        <Text style={{ display: 'block', fontSize: '15px', marginTop: '6px', color: '#1e293b' }}>
                            • Arancel Liquidado: {" "}<span style={{ fontWeight: 700 }}>${valoresFinales?.costo?.toFixed(2)}</span>
                        </Text>
                        <Text style={{ display: 'block', fontSize: '15px', marginTop: '6px', color: '#1e293b' }}>
                            • Motivo: {" "}{valoresFinales?.motivo?.replace('_', ' ')}
                        </Text>
                    </div>
                    <Text type="secondary" style={{ fontSize: '12px', display: 'block', marginTop: '12px' }}>
                        Esta acción imprimirá la orden física y descontará los insumos del inventario local de la comuna.
                    </Text>
                </Modal>

            </div>
        </div>
    );
}