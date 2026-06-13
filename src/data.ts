import { Product } from './types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'strong-man-syrup',
    name: 'Strong Man Power Herbal Syrup',
    category: 'Performance Boosters',
    categories: ['Performance Boosters', 'Sexual Wellness'],
    brand: 'Strong Man',
    price: 15000,
    oldPrice: 20000,
    discount: 25,
    description: 'Natural herbal product that gives an all-natural and permanent remedy for erectile dysfunction, rapid and premature ejaculation, weak erections, and promotes a larger penis. Formulated from premium 100% natural bio-extracts with absolutely zero side effects.',
    features: [
      'Cures premature ejaculation & weak erection permanently in 7 days',
      'Helps you gain strong & lasting erections instantly 45 minutes after taking it',
      'Permanently increases penis thickness, length, and size in 2 weeks',
      'Boosts sex drive and libido by 100% to keep you going longer with high stamina',
      'Removes male impotence & erectile dysfunction naturally',
      'Increases sexual stimulation, arousal, and prolongs lovemaking sessions',
      'Helps increase daily energy, stamina, vitality, and physical endurance',
      'Promotes robust blood circulation to your local active tissues',
      'Supports optimal prostate health and cures low sperm count',
      '100% Natural organic blend with absolutely zero chemical side effects'
    ],
    image: '/src/assets/images/strong_man_syrup_1781212742827.jpg',
    rating: 4.9,
    stock: 250,
    isFeatured: true,
    packages: [
      { bottles: 1, price: 15000, oldPrice: 20000, label: 'Single Trial Pack' },
      { bottles: 2, price: 25000, oldPrice: 40000, label: 'Double Couple Pack (Popular)' },
      { bottles: 3, price: 30000, oldPrice: 60000, label: 'Triple Pro-Stamina Treatment' },
      { bottles: 6, price: 50000, oldPrice: 120000, label: 'Family/Reseller Wholesale Pack' },
      { bottles: 10, price: 90000, oldPrice: 200000, label: 'Ultimate Mega Bulk Pack' }
    ]
  }
];

export const BRANDS = [
  'Strong Man'
];

export const CATEGORIES = [
  { name: 'Performance Boosters', displayName: 'Performance Boosters', icon: 'Zap' },
  { name: 'Sexual Wellness', displayName: 'Sexual Wellness', icon: 'Heart' }
];

export const FORMAT_CURRENCY = (amount: number): string => {
  return '₦' + amount.toLocaleString('en-NG');
};
