'use client';

import React from 'react';
import { Button } from 'antd';
import Link from 'next/link';

// Esta va a ser la pantalla principal al entrar a http://localhost:3000
export default function HomePage() {
  return (
    <div style={{ padding: '50px', textAlign: 'center' }}>
      <h1>Sistema de Gestión de Licencias de Conducir</h1>
      <p style={{ margin: '20px 0' }}>Bienvenido al sistema municipal.</p>

      <Link href="/titular/alta">
        <Button type="primary" size="large">Ir a Alta de Titular (HU09)</Button>
      </Link>
    </div>
  );
}