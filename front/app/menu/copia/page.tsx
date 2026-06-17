'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Form, Input, Button, Card, Row, Col, Typography, Flex, Divider, message, Steps, Statistic, Descriptions, Tag } from 'antd';
import { SearchOutlined, ArrowLeftOutlined, CopyOutlined, DollarOutlined, IdcardOutlined, CheckCircleOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

export default function EmitirCopiaLicencia() {
    const router = useRouter();
    const [formBusqueda] = Form.useForm();
    const [currentStep, setCurrentStep] = useState<number>(0);
    const [loadingBusqueda, setLoadingBusqueda] = useState<boolean>(false);
    const [loadingEmision, setLoadingEmision] = useState<boolean>(false);

    const [licenciaVigente, setLicenciaVigente] = useState<any | null>(null);
    const COSTO_DUPLICADO = 50.00;
    //HAY Q CAMBIAR ESTO PERO ES DE PRUEBA
    const manejarBusqueda = async (values: { documento: string }) => {
        setLoadingBusqueda(true);
        try {
            console.log('🔍 Buscando licencia vigente para DNI:', values.documento);
            await new Promise((resolve) => setTimeout(resolve, 1200));

            const response = await fetch(`http://localhost:8080/api/licencias/titular?nroDocumento=${values.documento}`);
            const data = await response.json();

            if (response.ok) {
                setLicenciaVigente({
                    titular: data.nombre + " " + data.apellido,
                    dni: data.nroDocumentoTitular,
                    clase: data.clase,
                    fechaEmision: data.fechaEmision,
                    fechaVencimiento: data.fechaVencimiento,
                    estado: data.estado,
                    grupoSanguineo: data.grupoSanguineo + data.factorRh,
                    donante: data.donante
                });
                message.success('Licencia vigente localizada con éxito.');
                setCurrentStep(1);
            } else {
                setLicenciaVigente(null);
                message.warning('No se encontraron licencias vigentes asociadas a ese documento.');
            }
        } catch (error) {
            message.error('Error de conexión con el servidor.');
        } finally {
            setLoadingBusqueda(false);
        }
    };

    const confirmarEmisionCopia = async () => {
        setLoadingEmision(true);
        try {
            const payload = {
                licenciaOriginalId: licenciaVigente.id,
                dniTitular: licenciaVigente.dni,
                motivo: "DUPLICADO_POR_EXTRAVIO",
                operadorLegajo: "L-45902",
                costoAbonado: COSTO_DUPLICADO
            };

            const response = await fetch('http://localhost:8080/api/licencias/copia', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                message.success('¡Copia de licencia registrada e impresa de forma exitosa!');
                setCurrentStep(2);
            } else {
                const errorTexto = await response.text();
                message.error(errorTexto || 'Error al procesar la copia en el sistema.');
            }
        } catch (error) {
            console.error('Error al emitir:', error);
            message.error('Error de comunicación con el backend al intentar persistir.');
        } finally {
            setLoadingEmision(false);
        }
    };

    const reiniciarTramite = () => {
        formBusqueda.resetFields();
        setLicenciaVigente(null);
        setCurrentStep(0);
    };

    return (
        <div style={{ background: '#f5f7fa', height: '100vh', maxHeight: '100vh', overflow: 'hidden', padding: '30px 24px' }}>
            <div style={{ maxWidth: 950, margin: '0 auto' }}>

                <Flex align="center" justify="space-between" style={{ marginBottom: '24px' }}>
                    <Flex align="center" gap="14px">
                        <div style={{ width: '5px', height: '38px', backgroundColor: '#722ed1', borderRadius: '3px' }} />
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <Title level={2} style={{ margin: 0, fontWeight: 800, letterSpacing: '-0.02em', lineHeight: '1.2', fontSize: '26px' }}>
                                <span style={{ color: '#8c8c8c', fontWeight: 400 }}>Región</span>{' '}
                                <span style={{ background: 'linear-gradient(45deg, #141414, #722ed1)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                                    Santa Fe
                                </span>
                                <span style={{ color: '#bfbfbf', fontWeight: 300, margin: '0 10px' }}>|</span>
                                <span style={{ color: '#262626', fontSize: '20px', fontWeight: 600, verticalAlign: 'middle' }}>
                                    Emisión de Copias y Duplicados
                                </span>
                            </Title>
                        </div>
                    </Flex>
                    <Button
                        type="text"
                        icon={<ArrowLeftOutlined style={{ fontSize: '16px' }} />}
                        onClick={() => router.push('/menu')}
                        disabled={currentStep === 1 || loadingEmision}
                        style={{ display: 'flex', alignItems: 'center', fontWeight: 600, color: '#475569', fontSize: '15px', height: '40px' }}
                    >
                        Volver al Menú
                    </Button>
                </Flex>

                <Steps
                    current={currentStep}
                    style={{ marginBottom: '28px', padding: '0 10px' }}
                    items={[
                        { title: <span style={{ fontSize: '15px', fontWeight: 500 }}>Buscar Original</span> },
                        { title: <span style={{ fontSize: '15px', fontWeight: 500 }}>Verificar y Liquidar</span> },
                        { title: <span style={{ fontSize: '15px', fontWeight: 500 }}>Finalizado</span> },
                    ]}
                />

                <Flex vertical gap="16px">

                    {currentStep === 0 && (
                        <Card variant="borderless" style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.05)', borderRadius: '12px', padding: '8px' }}>
                            <div style={{ marginBottom: '20px' }}>
                                <Text strong style={{ fontSize: '18px', color: '#1e293b', display: 'block' }}>Localizar Licencia en el Sistema</Text>
                                <Text type="secondary" style={{ fontSize: '14px', display: 'block', marginTop: '6px' }}>Ingrese el número de documento del contribuyente para validar la vigencia de su carnet actual.</Text>
                            </div>
                            <Form form={formBusqueda} layout="inline" onFinish={manejarBusqueda} style={{ alignItems: 'flex-start' }}>
                                <Form.Item
                                    name="documento"
                                    rules={[
                                        { required: true, message: 'Falta el documento.' },
                                        { pattern: /^[0-9]+$/, message: 'Solo números.' }
                                    ]}
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
                                        style={{ background: '#722ed1', height: '54px', fontSize: '16px', fontWeight: 'bold', padding: '0 24px', borderRadius: '8px' }}
                                    >
                                        Buscar Registro
                                    </Button>
                                </Form.Item>
                            </Form>
                        </Card>
                    )}

                    {currentStep === 1 && licenciaVigente && (
                        <Row gutter={20}>
                            <Col span={15}>
                                <Card
                                    variant="borderless"
                                    title={<span style={{ fontSize: '17px', fontWeight: 700 }}><IdcardOutlined style={{ marginRight: 8, color: '#722ed1' }} /> Datos del Plástico Original</span>}
                                    style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.05)', borderRadius: '12px' }}
                                >
                                    <Descriptions
                                        column={2}
                                        bordered
                                        size="middle"
                                        layout="vertical"
                                        styles={{
                                            label: {
                                                fontSize: '14px',
                                                fontWeight: 600,
                                                background: '#f8fafc',
                                                color: '#475569',
                                            },
                                            content: {
                                                fontSize: '15px',
                                                color: '#1e293b',
                                                fontWeight: 500,
                                            },
                                        }}
                                    >
                                        <Descriptions.Item label="Titular Afiliado" span={2}>
                                            <Text strong style={{ color: '#1e293b', fontSize: '18px' }}>{licenciaVigente.titular}</Text>
                                        </Descriptions.Item>
                                        <Descriptions.Item label="Documento N°"><Text style={{ fontSize: '16px', fontWeight: 600 }}>{licenciaVigente.dni}</Text></Descriptions.Item>
                                        <Descriptions.Item label="Clase Otorgada"><Tag color="purple" style={{ fontSize: '13px', fontWeight: 'bold', padding: '4px 10px' }}>Clase {licenciaVigente.clase}</Tag></Descriptions.Item>
                                        <Descriptions.Item label="Fecha de Emisión">{licenciaVigente.fechaEmision}</Descriptions.Item>
                                        <Descriptions.Item label="Fecha de Vencimiento"><Text strong style={{ color: '#2fbd1b', fontSize: '16px' }}>{licenciaVigente.fechaVencimiento}</Text></Descriptions.Item>
                                        <Descriptions.Item label="Grupo Sanguíneo">{licenciaVigente.grupoSanguineo}</Descriptions.Item>
                                        <Descriptions.Item label="Donante de Órganos">{licenciaVigente.donante}</Descriptions.Item>
                                    </Descriptions>
                                </Card>
                            </Col>

                            <Col span={9}>
                                <Card
                                    variant="borderless"
                                    title={<span style={{ fontSize: '17px', fontWeight: 700 }}><DollarOutlined style={{ marginRight: 8, color: '#52c41a' }} /> Liquidación</span>}
                                    style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.05)', borderRadius: '12px', height: '100%' }}
                                >
                                    <Flex vertical justify="space-between" style={{ height: '100%', minHeight: '260px' }}>
                                        <div>
                                            <Statistic
                                                title={<span style={{ fontSize: '14px', color: '#64748b', fontWeight: 500 }}>Arancel de Reimpresión</span>}
                                                value={COSTO_DUPLICADO}
                                                precision={2}
                                                prefix="$"
                                                styles={{ content: { color: '#0f172a', fontWeight: 900, fontSize: '38px' } }}
                                            />
                                            <Text type="secondary" style={{ fontSize: '13px', display: 'block', marginTop: '8px', lineHeight: '1.4' }}>
                                                Incluye las tasas provinciales e insumos del plástico físico reflectivo.
                                            </Text>
                                        </div>

                                        <Flex vertical gap="10px">
                                            <Button
                                                type="primary"
                                                size="large"
                                                icon={<CopyOutlined style={{ fontSize: '18px' }} />}
                                                block
                                                onClick={confirmarEmisionCopia}
                                                loading={loadingEmision}
                                                style={{ background: '#722ed1', height: '54px', fontSize: '16px', fontWeight: 'bold', borderRadius: '8px' }}
                                            >
                                                Confirmar Emisión
                                            </Button>
                                            <Button type="text" danger block onClick={reiniciarTramite} disabled={loadingEmision} style={{ fontSize: '14px', fontWeight: 600 }}>
                                                Cancelar Trámite
                                            </Button>
                                        </Flex>
                                    </Flex>
                                </Card>
                            </Col>
                        </Row>
                    )}

                    {currentStep === 2 && (
                        <Card variant="borderless" style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.05)', borderRadius: '12px', textAlign: 'center', padding: '40px 20px' }}>
                            <CheckCircleOutlined style={{ fontSize: '72px', color: '#52c41a', marginBottom: '20px' }} />
                            <Title level={3} style={{ margin: '0 0 12px 0', fontWeight: 800 }}>¡Comprobante de Copia Emitido!</Title>
                            <Text type="secondary" style={{ maxWidth: '600px', margin: '0 auto 28px auto', display: 'block', fontSize: '15px', lineHeight: '1.5' }}>
                                El trámite se concretó en sistema. Se mandó la orden de impresión para el titular <Text strong style={{ color: '#0f172a' }}>{licenciaVigente?.titular}</Text> bajo el mismo vencimiento original ({licenciaVigente?.fechaVencimiento}).
                            </Text>
                            <Flex justify="center" gap="large">
                                <Button type="primary" onClick={reiniciarTramite} style={{ background: '#722ed1', height: '50px', fontSize: '15px', fontWeight: 'bold', padding: '0 24px', borderRadius: '8px' }}>
                                    Iniciar Nuevo Trámite
                                </Button>
                                <Button type="dashed" onClick={() => router.push('/menu')} style={{ height: '50px', fontSize: '15px', fontWeight: '500', padding: '0 24px', borderRadius: '8px' }}>
                                    Volver al Menú Principal
                                </Button>
                            </Flex>
                        </Card>
                    )}

                </Flex>

            </div>
        </div>
    );
}