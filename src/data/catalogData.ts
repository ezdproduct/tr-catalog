export interface Hotspot {
  x: number;
  y: number;
  label: string;
  targetItemId: string;
  quickInfo: {
    name: string;
    sku: string;
    dimension: string;
    thumbnail: string;
  };
}

export interface ProductItem {
  id: string;
  name: string;
  sku: string;
  dimension: string;
  images: {
    collapsed: string;
    extended: string;
    features?: string[];
  };
}

export interface ColorVariant {
  id: string;
  colorName: string;
  overviewImage: string;
  hotspots: Hotspot[];
  items: ProductItem[];
  description?: string;
}

export interface ProductLine {
  id: string;
  name: string;
  menuLabel: string;
  variants: ColorVariant[];
}

const R2_URL = 'https://pub-bbdb196f0a274c96b24ae86158ee4e36.r2.dev/catalog';

export const catalogData: ProductLine[] = [
  {
    id: "extendable-dining-set",
    name: "EXTENDABLE DINING SET",
    menuLabel: "Dining Set",
    variants: [
      {
        id: "dining-oak",
        colorName: "OAK FINISH",
        overviewImage: `${R2_URL}/export/6-1.png`,
        description: `<strong>Smart expandable Dining Set</strong>\nBring elegance and flexibility to your modern living space. This intelligently designed dining table seamlessly transforms from a compact 6-seat round table for daily use into a spacious 10-seat table for family gatherings or entertaining guests – all with just a few effortless movements. The table in oak finish is crafted for warm, inviting spaces where simplicity meets function.\n\n<strong>Modern, elegant design</strong>, fit perfectly into any interior style.\n<strong>Smart sliding mechanism</strong>, sturdy and smooth in every transition.\n<strong>Premium wood materials</strong>, ensuring durability and timeless beauty.\n<strong>Space-saving solution</strong> ideal for urban homes and apartments.\n\nThe perfect balance between functionality and sophistication for your dining space.`,
        hotspots: [
          {
            x: 50, y: 68, label: "Bench", targetItemId: "1-bench",
            quickInfo: { name: "R057- BENCH", sku: "R057BEN-C072", dimension: "2620 x 362 x 465 (mm)", thumbnail: `${R2_URL}/6/Untitled-13.png` }
          },
          {
            x: 50, y: 55, label: "Table", targetItemId: "1-table",
            quickInfo: { name: "R057- TABLE", sku: "R057TAB-C072", dimension: "2676 x 146 x 755 (mm)", thumbnail: `${R2_URL}/6/Untitled-14.png` }
          },
          {
            x: 80, y: 45, label: "Buffet", targetItemId: "1-buffet",
            quickInfo: { name: "R057- BUFFET", sku: "R057BUF-C072", dimension: "1500 x 480 x 780 (mm)", thumbnail: `${R2_URL}/6/Untitled-15.png` }
          }
        ],
        items: [
          { 
            id: "1-bench", 
            name: "R057- BENCH – OAK FINISH", 
            sku: " R057BEN-C072", 
            dimension: "2620 x 362 x 465 (mm)", 
            images: { 
              collapsed: `${R2_URL}/6/Untitled-13.png`, 
              extended: `${R2_URL}/6/Untitled-17.png` 
            } 
          },
          { 
            id: "1-table", 
            name: "R057- TABLE – OAK FINISH", 
            sku: "R057TAB-C072", 
            dimension: "2676 x 146 x 755 (mm)", 
            images: { 
              collapsed: `${R2_URL}/6/Untitled-14.png`, 
              extended: `${R2_URL}/6/Untitled-18.png` 
            } 
          },
          { 
            id: "1-buffet", 
            name: "R057- BUFFET – OAK FINISH", 
            sku: "R057BUF-C072", 
            dimension: "1500 x 480 x 780 (mm)", 
            images: { 
              collapsed: `${R2_URL}/6/Untitled-15.png`, 
              extended: `${R2_URL}/6/Untitled-16.png` 
            } 
          },
        ]
      },
      {
        id: "dining-walnut",
        colorName: "WALNUT FINISH",
        overviewImage: `${R2_URL}/export/5-1.png`,
        description: `<strong>Smart expandable Dining Set</strong>\nBring elegance and flexibility to your modern living space. This intelligently designed dining table seamlessly transforms from a compact 6-seat round table for daily use into a spacious 10-seat table for family gatherings or entertaining guests-all with just a few effortless movements. The darker walnut tone enhances the natural elegance of the wood, while the rounded form offers a balanced mix of comfort and versatility.\n\n<strong>Modern, elegant design</strong>, fit perfectly into any interior style.\n<strong>Smart sliding mechanism</strong>, sturdy and smooth in every transition.\n<strong>Premium wood materials</strong>, ensuring durability and timeless beauty.\n<strong>Space-saving solution</strong> ideal for urban homes and apartments.\nThe perfect balance between functionality and sophistication for your dining space.`,
        hotspots: [
          {
            x: 50, y: 68, label: "Bench", targetItemId: "2-bench",
            quickInfo: { name: "R057- BENCH", sku: "R057BEN-C073", dimension: "2620 x 362 x 465 (mm)", thumbnail: `${R2_URL}/5/Untitled-7.png` }
          },
          {
            x: 50, y: 55, label: "Table", targetItemId: "2-table",
            quickInfo: { name: "R057- TABLE", sku: "R057TAB-C073", dimension: "2676 x 146 x 755 (mm)", thumbnail: `${R2_URL}/5/Untitled-8.png` }
          },
          {
            x: 80, y: 45, label: "Buffet", targetItemId: "2-buffet",
            quickInfo: { name: "R057- BUFFET", sku: "R057BUF-C073", dimension: "1500 x 480 x 780 (mm)", thumbnail: `${R2_URL}/5/Untitled-9.png` }
          }
        ],
        items: [
          { 
            id: "2-bench", 
            name: "R057- BENCH – WALNUT FINISH", 
            sku: " R057BEN-C073", 
            dimension: "2620 x 362 x 465 (mm)", 
            images: { 
              collapsed: `${R2_URL}/5/Untitled-7.png`, 
              extended: `${R2_URL}/5/Untitled-12.png` 
            } 
          },
          { 
            id: "2-table", 
            name: "R057- TABLE – WALNUT FINISH", 
            sku: "R057TAB-C073", 
            dimension: "2676 x 146 x 755 (mm)", 
            images: { 
              collapsed: `${R2_URL}/5/Untitled-8.png`, 
              extended: `${R2_URL}/5/Untitled-11.png` 
            } 
          },
          { 
            id: "2-buffet", 
            name: "R057- BUFFET – WALNUT FINISH", 
            sku: "R057BUF-C073", 
            dimension: "1500 x 480 x 780 (mm)", 
            images: { 
              collapsed: `${R2_URL}/5/Untitled-9.png`, 
              extended: `${R2_URL}/5/Untitled-10.png` 
            } 
          },
        ]
      }
    ]
  },
  {
    id: "gaming-table",
    name: "SMART TRANSFORMABLE DINING AND GAMING TABLE",
    menuLabel: "Gaming Table",
    variants: [
      {
        id: "gaming-oak",
        colorName: "OAK FINISH",
        overviewImage: `${R2_URL}/export/4-1.png`,
        description: `Experience the perfect fusion of functionality and entertainment. This innovative table seamlessly transforms from a stylish dining table for daily use into a versatile gaming table, ideal for board games, cards, or even poker nights with friends and family. Its solid Oak surface ensures durability, while the clean geometry keeps a light, balanced look.\n\n<strong>Dual-purpose design</strong>: Dining and gaming in one elegant solution.\n<strong>Expandable system</strong>: Round 6-seater extended 10-seater.\n<strong>Removable tabletop</strong>: Reveals a well-crafted gaming surface beneath.\n<strong>Premium materials and sturdy structure</strong> ensure stability and durability.\n<strong>Modern aesthetic</strong> blends easily into both dining and entertainment spaces.\nA centerpiece that adapts to every moment – from family meals to game nights.`,
        hotspots: [
          {
            x: 50, y: 30, label: "Table", targetItemId: "3-table",
            quickInfo: { name: "R068- TABLE", sku: "R068TAB-C072", dimension: "2676 x 1146 x 755 (mm)", thumbnail: `${R2_URL}/4/Untitled-25.png` }
          },
          {
            x: 30, y: 50, label: "Chair", targetItemId: "3-chair",
            quickInfo: { name: "R068- CHAIR", sku: "R068CHA-C070", dimension: "480 x 546 x 791 (mm)", thumbnail: `${R2_URL}/4/Untitled-27.png` }
          }
        ],
        items: [
          { 
            id: "3-table", 
            name: "R068- TABLE– OAK FINISH", 
            sku: " R068TAB-C072", 
            dimension: "2676 x 1146 x 755 (mm)", 
            images: { 
              collapsed: `${R2_URL}/4/Untitled-25.png`, 
              extended: `${R2_URL}/4/Untitled-26.png` 
            } 
          },
          { 
            id: "3-chair", 
            name: "R068- CHAIR – OAK FINISH", 
            sku: " R068CHA-C070", 
            dimension: "480 x 546 x 791 (mm)", 
            images: { 
              collapsed: `${R2_URL}/4/Untitled-27.png`, 
              extended: `${R2_URL}/4/Untitled-27.png` 
            } 
          },
        ]
      },
      {
        id: "gaming-walnut",
        colorName: "WALNUT FINISH",
        overviewImage: `${R2_URL}/export/3-1.png`,
        description: `Experience the perfect fusion of functionality and entertainment. This innovative table seamlessly transforms from a stylish dining table for daily use into a versatile gaming table, ideal for board games, cards, or even poker nights with friends and family. Its Walnut warm finish enhances contemporary or transitional interiors while maintaining our signature minimalist approach.\n\n<strong>Dual-purpose design</strong>: Dining and gaming in one elegant solution.\n<strong>Expandable system</strong>: Round 6-seater extended 10-seater.\n<strong>Removable tabletop</strong>: Reveals a well-crafted gaming surface beneath.\n<strong>Premium materials and sturdy structure</strong> ensure stability and durability.\n<strong>Modern aesthetic</strong> blends easily into both dining and entertainment spaces.\nA centerpiece that adapts to every moment – from family meals to game nights.`,
        hotspots: [
          {
            x: 50, y: 30, label: "Table", targetItemId: "4-table",
            quickInfo: { name: "R068- TABLE", sku: "R068TAB-C073", dimension: "2676 x 1146 x 755 (mm)", thumbnail: `${R2_URL}/3/Untitled-28.png` }
          },
          {
            x: 30, y: 50, label: "Chair", targetItemId: "4-chair",
            quickInfo: { name: "R068- CHAIR", sku: "R068CHA-C064", dimension: "480 x 546 x 791 (mm)", thumbnail: `${R2_URL}/3/Untitled-30.png` }
          }
        ],
        items: [
          { 
            id: "4-table", 
            name: "R068- TABLE– WALNUT FINISH", 
            sku: " R068TAB-C073", 
            dimension: "2676 x 1146 x 755 (mm)", 
            images: { 
              collapsed: `${R2_URL}/3/Untitled-28.png`, 
              extended: `${R2_URL}/3/Untitled-29.png` 
            } 
          },
          { 
            id: "4-chair", 
            name: "R068- CHAIR – WALNUT FINISH", 
            sku: " R068CHA-C064", 
            dimension: "480 x 546 x 791 (mm)", 
            images: { 
              collapsed: `${R2_URL}/3/Untitled-30.png`, 
              extended: `${R2_URL}/3/Untitled-30.png` 
            } 
          },
        ]
      }
    ]
  },
  {
    id: "outdoor-dining-set",
    name: "EXPANDABLE OUTDOOR DINING SET",
    menuLabel: "Outdoor Dining Set",
    variants: [
      {
        id: "outdoor-teak",
        colorName: "TEAK WOOD",
        overviewImage: `${R2_URL}/export/2-1.png`,
        description: `Built for both style and durability, this outdoor dining set combines a lightweight aluminum frame with Teak wooden slats, coated with a weather-resistant protective finish – making it ideal for garden, patios and outdoor entertaining spaces.\n<strong>Convertible design</strong>: round 6-seater extend to 10-seater.\n<strong>Aluminum frame</strong> provides excellent strength and rust resistance\n<strong>Teak wood</strong> slats add natural warmth and elegance.\n<strong>Protective coating</strong> ensures long-lasting beauty in outdoor conditions.\n<strong>Modern design</strong> blends perfectly with any outdoor setting.\nA perfect balance of comfort, durability, and timeless outdoor style.`,
        hotspots: [
          {
            x: 35, y: 65, label: "Bench", targetItemId: "5-bench",
            quickInfo: { name: "R074- BENCH", sku: "R074BEN-C074", dimension: "2612 x 375 x 470 (mm)", thumbnail: `${R2_URL}/1/Untitled-1.png` }
          },
          {
            x: 50, y: 55, label: "Table", targetItemId: "5-table",
            quickInfo: { name: "R074- TABLE", sku: "R074TAB-C074", dimension: "2462 x 1000 x 754 (mm)", thumbnail: `${R2_URL}/1/Untitled-2.png` }
          },
          {
            x: 80, y: 70, label: "Chair", targetItemId: "5-chair",
            quickInfo: { name: "R074- CHAIR", sku: "R074CHA-C074", dimension: "510 x 580 x 825 (mm)", thumbnail: `${R2_URL}/1/Untitled-3.png` }
          },
          {
            x: 25, y: 15, label: "Barcart", targetItemId: "5-barcart",
            quickInfo: { name: "R074- BARCART", sku: "R074BAR-C074", dimension: "1060 x 606 x 735 (mm)", thumbnail: `${R2_URL}/1/Untitled-6.png` }
          }
        ],
        items: [
          { 
            id: "5-bench", 
            name: "R074- BENCH – TEAK WOOD", 
            sku: " R074BEN-C074", 
            dimension: "2612 x 375 x 470 (mm)", 
            images: { 
              collapsed: `${R2_URL}/1/Untitled-1.png`, 
              extended: `${R2_URL}/1/Untitled-4.png`  
            } 
          },
          { 
            id: "5-table", 
            name: "R074- TABLE – TEAK WOOD", 
            sku: " R074TAB-C074", 
            dimension: "2462 x 1000 x 754 (mm)", 
            images: { 
              collapsed: `${R2_URL}/1/Untitled-2.png`, 
              extended: `${R2_URL}/1/Untitled-5.png`              
            } 
          },
          { 
            id: "5-chair", 
            name: "R074- CHAIR – TEAK WOOD", 
            sku: " R074CHA-C074", 
            dimension: "510 x 580 x 825 (mm)", 
            images: { 
              collapsed: `${R2_URL}/1/Untitled-3.png`, 
              extended: `${R2_URL}/1/Untitled-3.png` 
            } 
          },
          { 
            id: "5-barcart", 
            name: "R074- BARCART – TEAK WOOD", 
            sku: " R074BAR-C074", 
            dimension: "1060 x 606 x 735 (mm)", 
            images: { 
              collapsed: `${R2_URL}/1/Untitled-6.png`, 
              extended: `${R2_URL}/1/Untitled-6.png` 
            } 
          },
        ]
      },
      {
        id: "outdoor-acacia",
        colorName: "ACACIA WALNUT FINISH",
        overviewImage: `${R2_URL}/export/1-1.png`,
        description: `Built for both style and durability, this outdoor dining set combines a lightweight aluminum frame with Acacia wooden slats, coated with a weather-resistant protective finish – making it ideal for garden, patios, and outdoor entertaining spaces.\n<strong>Convertible design</strong>: round 6-seater extend to 10-seater\n<strong>Aluminum frame</strong> provides excellent strength and rust resistance\n<strong>Acacia wood</strong> slats add natural warmth and elegance.\n<strong>Protective coating</strong> ensures long-lasting beauty in outdoor conditions.\n<strong>Modern design</strong> blends perfectly with any outdoor setting\nA perfect balance of comfort, durability, and timeless outdoor style.`,
        hotspots: [
          {
            x: 35, y: 65, label: "Bench", targetItemId: "6-bench",
            quickInfo: { name: "R074- BENCH", sku: "R074BEN-C075", dimension: "2612 x 375 x 470 (mm)", thumbnail: `${R2_URL}/2/Untitled-19.png` }
          },
          {
            x: 50, y: 55, label: "Table", targetItemId: "6-table",
            quickInfo: { name: "R074- TABLE", sku: "R074TAB-C075", dimension: "2462 x 1000 x 754 (mm)", thumbnail: `${R2_URL}/2/Untitled-20.png` }
          },
          {
            x: 80, y: 70, label: "Chair", targetItemId: "6-chair",
            quickInfo: { name: "R074- CHAIR", sku: "R074CHA-C075", dimension: "510 x 580 x 825 (mm)", thumbnail: `${R2_URL}/2/Untitled-21.png` }
          },
          {
            x: 25, y: 15, label: "Barcart", targetItemId: "6-barcart",
            quickInfo: { name: "R074- BARCART", sku: "R074BAR-C075", dimension: "1060 x 606 x 735 (mm)", thumbnail: `${R2_URL}/2/Untitled-22.png` }
          }
        ],
        items: [
          { 
            id: "6-bench", 
            name: "R074- BENCH - ACACIA WALNUT FINISH", 
            sku: " R074BEN-C075", 
            dimension: "2612 x 375 x 470 (mm)", 
            images: { 
              collapsed: `${R2_URL}/2/Untitled-19.png`, 
              extended: `${R2_URL}/2/Untitled-24.png` 
            } 
          },
          { 
            id: "6-table", 
            name: "R074- TABLE - ACACIA WALNUT FINISH", 
            sku: " R074TAB-C075", 
            dimension: "2462 x 1000 x 754 (mm)", 
            images: { 
              collapsed: `${R2_URL}/2/Untitled-20.png`, 
              extended: `${R2_URL}/2/Untitled-23.png` 
            } 
          },
          { 
            id: "6-chair", 
            name: "R074- CHAIR – ACACIA WALNUT FINISH", 
            sku: " R074CHA-C075", 
            dimension: "510 x 580 x 825 (mm)", 
            images: { 
              collapsed: `${R2_URL}/2/Untitled-21.png`, 
              extended: `${R2_URL}/2/Untitled-21.png` 
            } 
          },
          { 
            id: "6-barcart", 
            name: "R074- BARCART – ACACIA WALNUT FINISH", 
            sku: " R074BAR-C075", 
            dimension: "1060 x 606 x 735 (mm)", 
            images: { 
              collapsed: `${R2_URL}/2/Untitled-22.png`, 
              extended: `${R2_URL}/2/Untitled-22.png` 
            } 
          },
        ]
      }
    ]
  }
];
