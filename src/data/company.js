/* ============================================================
   CoffeeBot company details — shown on the Contact page and footer.
   Taken from the contact details published on coffeebot.com.my
   (checked October 2026). Update here if they change.
   ============================================================ */
export const COMPANY = {
  email: 'info@coffeebot.com.sg',
  website: 'https://www.coffeebot.com.my',
  offices: [
    {
      country: 'Singapore',
      name: 'Coffeebot Singapore Pte Ltd',
      address: ['8 Lorong Bakar Batu #05-01', 'Singapore 348743'],
      phones: ['+65 8020 2388'],
      email: 'info@coffeebot.com.sg',
    },
    {
      country: 'Malaysia',
      name: 'Coffeebot Holdings Sdn Bhd',
      address: ['Lot PT 6208, Jalan PJS 7/23, Bandar Sunway', '47500 Subang Jaya, Selangor'],
      phones: ['+6012-262 2326', '+6012-232 6448'],
      email: 'info@coffeebot.com.my',
    },
  ],
};

export const telHref = (phone) => `tel:${phone.replace(/[^\d+]/g, '')}`;
