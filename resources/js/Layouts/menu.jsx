export const menu = [
  {
    section: "MANAGEMENT",
    items: [
      {
        label: "Products",
        icon: (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M6 6h12M6 12h12M6 18h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        ),
        children: [
          { label: "Product Register", routeName: "admin.products.create" },
          { label: "Product List", routeName: "admin.products.index" },
        ],
      },

      {
        label: "User Register",
        routeName: "admin.users.create",
        icon: (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path
              d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm13 10v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        ),
      },
    ],
  },
];
