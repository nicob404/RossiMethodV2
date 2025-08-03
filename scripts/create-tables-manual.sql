-- EJECUTA ESTE SCRIPT EN SUPABASE → SQL EDITOR SI LA CONFIGURACIÓN AUTOMÁTICA NO FUNCIONA

-- Crear tabla de usuarios
CREATE TABLE IF NOT EXISTS usuarios (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  nombre_completo TEXT NOT NULL,
  celular TEXT NOT NULL,
  google_id TEXT,
  fecha_registro TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  cursos_comprados TEXT[] DEFAULT '{}'::TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear tabla de compras
CREATE TABLE IF NOT EXISTS compras (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES usuarios(id) NOT NULL,
  curso TEXT NOT NULL,
  precio DECIMAL(10,2) NOT NULL,
  fecha_compra TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  mercadopago_payment_id TEXT NOT NULL,
  estado TEXT CHECK (estado IN ('completado', 'pendiente', 'fallido')) DEFAULT 'pendiente',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar Row Level Security
ALTER TABLE usuarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE compras ENABLE ROW LEVEL SECURITY;

-- Políticas de seguridad para usuarios
DROP POLICY IF EXISTS "Los usuarios pueden ver su propio perfil" ON usuarios;
CREATE POLICY "Los usuarios pueden ver su propio perfil" ON usuarios
  FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Los usuarios pueden actualizar su propio perfil" ON usuarios;
CREATE POLICY "Los usuarios pueden actualizar su propio perfil" ON usuarios
  FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS "Los usuarios pueden insertar su propio perfil" ON usuarios;
CREATE POLICY "Los usuarios pueden insertar su propio perfil" ON usuarios
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Políticas de seguridad para compras
DROP POLICY IF EXISTS "Los usuarios pueden ver sus propias compras" ON compras;
CREATE POLICY "Los usuarios pueden ver sus propias compras" ON compras
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Solo el sistema puede insertar compras" ON compras;
CREATE POLICY "Solo el sistema puede insertar compras" ON compras
  FOR INSERT WITH CHECK (true);

-- Índices para mejor rendimiento
CREATE INDEX IF NOT EXISTS idx_usuarios_email ON usuarios(email);
CREATE INDEX IF NOT EXISTS idx_compras_user_id ON compras(user_id);
CREATE INDEX IF NOT EXISTS idx_compras_payment_id ON compras(mercadopago_payment_id);

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para actualizar updated_at en usuarios
DROP TRIGGER IF EXISTS update_usuarios_updated_at ON usuarios;
CREATE TRIGGER update_usuarios_updated_at BEFORE UPDATE ON usuarios
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insertar usuario de prueba (opcional)
INSERT INTO usuarios (id, email, nombre_completo, celular, fecha_registro) 
VALUES ('00000000-0000-0000-0000-000000000001', 'test@rossimethod.com', 'Usuario de Prueba', '+54 9 11 1234-5678', NOW())
ON CONFLICT (id) DO NOTHING;

-- Insertar compra de prueba (opcional)
INSERT INTO compras (user_id, curso, precio, mercadopago_payment_id, estado) 
VALUES ('00000000-0000-0000-0000-000000000001', 'Full Planche Workshop', 97.00, 'test-payment-123', 'completado')
ON CONFLICT DO NOTHING;

-- Verificar que todo se creó correctamente
SELECT 'Tabla usuarios creada' as status, count(*) as registros FROM usuarios
UNION ALL
SELECT 'Tabla compras creada' as status, count(*) as registros FROM compras;
