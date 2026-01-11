export const menu = [
  {
    section: "MANAGEMENT",
    items: [
      {
        label: "Dashboard",
        routeName: "dashboard", // ✅ correct
        icon: (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path
              d="M3 13h8V3H3v10Zm10 8h8V11h-8v10ZM3 21h8v-6H3v6Zm10-12h8V3h-8v6Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        ),
      },

      {
        label: "Products",
        icon: (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path
              d="M6 6h12M6 12h12M6 18h12"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
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
