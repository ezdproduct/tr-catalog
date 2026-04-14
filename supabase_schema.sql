-- 1. Create Categories Table
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  image_url TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Create Products Table
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  stock INTEGER DEFAULT 0,
  image_urls TEXT[] DEFAULT '{}',
  rating DECIMAL(2,1) DEFAULT 0.0,
  material TEXT,
  color TEXT,
  dimensions TEXT,
  tag TEXT,
  is_featured BOOLEAN DEFAULT FALSE,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Create Profiles Table (Linked to Auth)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  role TEXT CHECK (role IN ('admin', 'user')) DEFAULT 'user',
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Create Reviews Table
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Create Contacts Table
CREATE TABLE contacts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT,
  message TEXT NOT NULL,
  status TEXT CHECK (status IN ('pending', 'replied')) DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Seed Data: Categories
INSERT INTO categories (name, slug, description) VALUES
('Living Room', 'living-room', 'Smart seating and entertainment units'),
('Bedroom', 'bedroom', 'Intelligent sleep systems and storage'),
('Office', 'office', 'Robotic desks and ergonomic workstations');

-- 7. Seed Data: Products
DO $$ 
DECLARE 
    living_id UUID;
    bedroom_id UUID;
    office_id UUID;
BEGIN
    SELECT id INTO living_id FROM categories WHERE slug = 'living-room';
    SELECT id INTO bedroom_id FROM categories WHERE slug = 'bedroom';
    SELECT id INTO office_id FROM categories WHERE slug = 'office';

    INSERT INTO products (category_id, name, description, price, stock, is_featured, rating, tag) VALUES
    (living_id, 'Morph-X Sofa', 'Smart-adaptive robotic sofa', 2499.00, 12, TRUE, 4.8, 'Bestseller'),
    (office_id, 'Gravity Desk', 'Magnetic levitation height-adjustable desk', 1899.00, 8, TRUE, 4.9, 'New'),
    (bedroom_id, 'Lumina Smart Bed', 'Bio-metric tracking sleep system', 4200.00, 4, TRUE, 5.0, 'Premium');
END $$;
