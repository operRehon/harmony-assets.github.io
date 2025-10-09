// =============================================
// КОНСТАНТЫ И ГЛОБАЛЬНЫЕ ПЕРЕМЕННЫЕ
// =============================================
const DOLLARS = 83;
const SHEET_WIDTH = 320;
const SHEET_HEIGHT = 450;
const CUT_MARGIN = 2;
const KRAS1_PRICES = [0.578313253, 0.5301204819, 0.4096385542, 0.3614457831, 0.313253012, 0.2891566265];
const KRAS2_PRICES = [1.13253012, 0.9638554217, 0.7228915663, 0.6987951807, 0.6265060241, 0.578313253];
const KRAS3_PRICE = 0.1445783133;
const KRAS4_PRICE = 0.2409638554;
const PAPER_PRICES = [0.01927710843, 0.06024096385, 0.09638554216, 0.12155121951, 0.17073170731, 0.20731707317, 0.91463414634, 1.0844, 0.2892, 0.1807228916, 0.2409638554, 0.30120481];
const EMBOSSING_SETUP = 8.4338;
const DIE_CUTTING_SETUP = 8.4338;
const MINIMAL_ORDER_COST = 200;
const CUTTING_PRICE_PER_HIT = 7.7;
const GLUING_PRICES = {2: 0.072289156, 3: 0.048192771};
const SCORING_PRICE_PER_HIT = 0.02409638556;
const FOLDING_PRICE_PER_HIT = 0.01204819278;
const CORNER_ROUNDING_PRICE = 0.02409638556;
const NUMBERING_PRICE = 0.01204819278;
const PERFORATION_PRICE = 0.01204819278;
const LAMINATION_PRICES = {1: 0.7229, 2: 1.2049, 3: 1.9278, 4: 1.8073};
const BINDING_PRICES_A4 = {20: 0.6024096386, 40: 0.6626506034, 50: 0.9036144588, 60: 1.024096386, 70: 1.204819287, 85: 1.385542169, 105: 1.56626516};
const BINDING_PRICES_A3 = {20: 1.265060241, 40: 1.325301205, 50: 1.445783133, 60: 1.56626516, 70: 1.686746988, 85: 1.807228916, 105: 2.048192781};
const VISITING_CARD_PRICES = {
    '1_10': [4.00, 3.50, 3.30, 3.00], '5_10': [5.50, 5.00, 4.50, 3.50], '2_10': [6.00, 5.50, 5.00, 4.50],
    '1_13': [6.00, 5.50, 5.00, 5.00], '5_13': [7.00, 6.50, 6.00, 6.00], '2_13': [8.00, 7.50, 7.00, 7.00],
    '1_14': [6.00, 5.50, 5.00, 5.00], '5_14': [7.00, 6.50, 6.00, 6.00], '2_14': [8.00, 7.50, 7.00, 7.00],
    '1_15': [6.00, 5.50, 5.00, 5.00], '5_15': [7.00, 6.50, 6.00, 6.00], '2_15': [8.00, 7.50, 7.00, 7.00]
};
const VISITING_CARD_PRICES_MATTE_LAMINATION = {
    '1_10': [8.00, 7.50, 7.30, 7.10], 
    '5_10': [9.65, 9.15, 8.65, 7.65],
    '2_10': [10.15, 9.65, 9.15, 8.65]
};
const VISITING_CARD_PRICES_SOFT_TOUCH_LAMINATION = {
    '1_10': [9.40, 8.90, 8.70, 8.40],
    '5_10': [10.90, 10.40, 9.90, 8.90],
    '2_10': [11.40, 10.90, 10.40, 9.90]
};
const FORMAT_SIZES = {
    1: { width: 297, height: 420 }, 2: { width: 210, height: 297 }, 3: { width: 148, height: 210 },
    4: { width: 105, height: 148 }, 5: { width: 74, height: 105 }, 6: { width: 52, height: 74 }
};
const BOOK_PRICES = {
    '4': 12, '2': { '51-100': 50, '101-500': 45, '500+': 40 }
};
const BOOK_LAMINATION_PRICES = {
    1: 15, // Глянцевая
    2: 35, // Матовая
    3: 25  // Софт тач
};
const BOOK_BINDING_PRICES = {
    'hard': {
        'A4': { 'min': 300, 'mid': 280, 'max': 250 },
        'A5': { 'min': 280, 'mid': 260, 'max': 230 },
        'A6': { 'min': 260, 'mid': 240, 'max': 200 }
    },
    'soft': { 'setup': 1500, 'per_book': 20
    },
    'staple': 25
};
const STORAGE_KEYS = {
    PRODUCTS: 'harmony_products',
    FORM_STATE: 'harmony_form_state',
    PRODUCT_COUNTER: 'harmony_product_counter'
};

let products = [];
let currentProductId = null;
let productCounter = { sheet: 1, visiting: 1, booklet: 1, book: 1 };