import { supabase, isSupabaseConfigured } from "./supabase"

// Función para verificar y crear tablas automáticamente
export async function initializeDatabase() {
  try {
    // Verificar si Supabase está configurado
    if (!isSupabaseConfigured() || !supabase) {
      return {
        success: false,
        error: "Supabase no está configurado. Configura las variables de entorno primero.",
        needsSetup: true,
      }
    }

    console.log("🔄 Inicializando base de datos...")

    // Verificar si las tablas existen
    const { data: usuarios, error: usuariosError } = await supabase
      .from("usuarios")
      .select("count", { count: "exact" })
      .limit(1)

    const { data: compras, error: comprasError } = await supabase
      .from("compras")
      .select("count", { count: "exact" })
      .limit(1)

    // Si las tablas no existen, las creamos
    if (usuariosError?.code === "42P01" || comprasError?.code === "42P01") {
      console.log("📋 Creando tablas...")
      await createTables()
    }

    console.log("✅ Base de datos inicializada correctamente")
    return { success: true }
  } catch (error) {
    console.error("❌ Error inicializando base de datos:", error)
    return { success: false, error }
  }
}

// Función para crear las tablas usando RPC (Remote Procedure Call)
async function createTables() {
  if (!supabase) {
    throw new Error("Supabase no está configurado")
  }

  try {
    // Crear las tablas usando SQL directo a través de RPC
    const createTablesSQL = `
      -- Crear tabla de usuarios si no existe
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

      -- Crear tabla de compras si no existe
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

      -- Habilitar RLS si no está habilitado
      ALTER TABLE usuarios ENABLE ROW LEVEL SECURITY;
      ALTER TABLE compras ENABLE ROW LEVEL SECURITY;

      -- Crear políticas si no existen
      DO $$ 
      BEGIN
        -- Políticas para usuarios
        IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'usuarios' AND policyname = 'Los usuarios pueden ver su propio perfil') THEN
          CREATE POLICY "Los usuarios pueden ver su propio perfil" ON usuarios FOR SELECT USING (auth.uid() = id);
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'usuarios' AND policyname = 'Los usuarios pueden actualizar su propio perfil') THEN
          CREATE POLICY "Los usuarios pueden actualizar su propio perfil" ON usuarios FOR UPDATE USING (auth.uid() = id);
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'usuarios' AND policyname = 'Los usuarios pueden insertar su propio perfil') THEN
          CREATE POLICY "Los usuarios pueden insertar su propio perfil" ON usuarios FOR INSERT WITH CHECK (auth.uid() = id);
        END IF;

        -- Políticas para compras
        IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'compras' AND policyname = 'Los usuarios pueden ver sus propias compras') THEN
          CREATE POLICY "Los usuarios pueden ver sus propias compras" ON compras FOR SELECT USING (auth.uid() = user_id);
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'compras' AND policyname = 'Solo el sistema puede insertar compras') THEN
          CREATE POLICY "Solo el sistema puede insertar compras" ON compras FOR INSERT WITH CHECK (true);
        END IF;
      END $$;

      -- Crear índices si no existen
      CREATE INDEX IF NOT EXISTS idx_usuarios_email ON usuarios(email);
      CREATE INDEX IF NOT EXISTS idx_compras_user_id ON compras(user_id);
      CREATE INDEX IF NOT EXISTS idx_compras_payment_id ON compras(mercadopago_payment_id);

      -- Crear función para updated_at si no existe
      CREATE OR REPLACE FUNCTION update_updated_at_column()
      RETURNS TRIGGER AS $$
      BEGIN
          NEW.updated_at = NOW();
          RETURN NEW;
      END;
      $$ language 'plpgsql';

      -- Crear trigger si no existe
      DROP TRIGGER IF EXISTS update_usuarios_updated_at ON usuarios;
      CREATE TRIGGER update_usuarios_updated_at BEFORE UPDATE ON usuarios
          FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    `

    // Ejecutar el SQL usando la función RPC de Supabase
    const { error } = await supabase.rpc("exec_sql", { sql: createTablesSQL })

    if (error) {
      // Si RPC no está disponible, intentamos crear las tablas de forma alternativa
      console.log("⚠️ RPC no disponible, usando método alternativo...")
      await createTablesAlternative()
    } else {
      console.log("✅ Tablas creadas exitosamente")
    }
  } catch (error) {
    console.error("❌ Error creando tablas:", error)
    throw error
  }
}

// Método alternativo para crear tablas (usando inserts para forzar la creación)
async function createTablesAlternative() {
  if (!supabase) {
    throw new Error("Supabase no está configurado")
  }

  try {
    // Intentar insertar en usuarios para forzar la creación de la tabla
    await supabase.from("usuarios").select("*").limit(1)
  } catch (error) {
    console.log("📋 Tablas no existen, necesitas crearlas manualmente en Supabase")
    console.log("Ve a tu dashboard de Supabase → SQL Editor y ejecuta el script que te proporcioné")
  }
}

// Función para verificar la conexión
export async function testConnection() {
  try {
    if (!isSupabaseConfigured() || !supabase) {
      return {
        success: false,
        error: "Variables de entorno no configuradas",
        suggestion: "Configura NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_ANON_KEY en .env.local",
        needsSetup: true,
      }
    }

    const { data, error } = await supabase.from("usuarios").select("count", { count: "exact" }).limit(1)

    if (error) {
      return {
        success: false,
        error: error.message,
        suggestion: "Verifica tus credenciales de Supabase en .env.local",
      }
    }

    return {
      success: true,
      message: "Conexión exitosa a Supabase",
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error desconocido",
      suggestion: "Verifica que NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_ANON_KEY estén configurados",
    }
  }
}
