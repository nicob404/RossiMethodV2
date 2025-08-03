-- Tabla de usuarios
CREATE TABLE usuarios (
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

-- Tabla de compras
CREATE TABLE compras (
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
CREATE POLICY "Los usuarios pueden ver su propio perfil" ON usuarios
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Los usuarios pueden actualizar su propio perfil" ON usuarios
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Los usuarios pueden insertar su propio perfil" ON usuarios
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Políticas de seguridad para compras
CREATE POLICY "Los usuarios pueden ver sus propias compras" ON compras
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Solo el sistema puede insertar compras" ON compras
  FOR INSERT WITH CHECK (true);

-- Índices para mejor rendimiento
CREATE INDEX idx_usuarios_email ON usuarios(email);
CREATE INDEX idx_compras_user_id ON compras(user_id);
CREATE INDEX idx_compras_payment_id ON compras(mercadopago_payment_id);

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para actualizar updated_at en usuarios
CREATE TRIGGER update_usuarios_updated_at BEFORE UPDATE ON usuarios
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
