export default [
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "_provider",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "_amount",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "_expirationTime",
        type: "uint256",
      },
    ],
    name: "BalanceLocked",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "_provider",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "_amount",
        type: "uint256",
      },
    ],
    name: "BalanceUnlocked",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "_prevOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "_newOwner",
        type: "address",
      },
    ],
    name: "OwnerUpdate",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "contract IConverterAnchor",
        name: "_poolAnchor",
        type: "address",
      },
      {
        indexed: false,
        internalType: "bool",
        name: "_added",
        type: "bool",
      },
    ],
    name: "PoolWhitelistUpdated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "_provider",
        type: "address",
      },
      {
        indexed: true,
        internalType: "contract IDSToken",
        name: "_poolToken",
        type: "address",
      },
      {
        indexed: true,
        internalType: "contract IERC20Token",
        name: "_reserveToken",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "_poolAmount",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "_reserveAmount",
        type: "uint256",
      },
    ],
    name: "ProtectionAdded",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "_provider",
        type: "address",
      },
      {
        indexed: true,
        internalType: "contract IDSToken",
        name: "_poolToken",
        type: "address",
      },
      {
        indexed: true,
        internalType: "contract IERC20Token",
        name: "_reserveToken",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "_poolAmount",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "_reserveAmount",
        type: "uint256",
      },
    ],
    name: "ProtectionRemoved",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "_provider",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "_prevPoolAmount",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "_prevReserveAmount",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "_newPoolAmount",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "_newReserveAmount",
        type: "uint256",
      },
    ],
    name: "ProtectionUpdated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "contract IERC20Token",
        name: "_token",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "_prevAmount",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "_newAmount",
        type: "uint256",
      },
    ],
    name: "SystemBalanceUpdated",
    type: "event",
  },
  {
    inputs: [],
    name: "acceptOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "_provider", type: "address" },
      { internalType: "uint256", name: "_amount", type: "uint256" },
      {
        internalType: "uint256",
        name: "_expirationTime",
        type: "uint256",
      },
    ],
    name: "addLockedBalance",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "contract IConverterAnchor",
        name: "_poolAnchor",
        type: "address",
      },
    ],
    name: "addPoolToWhitelist",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "_provider", type: "address" },
      {
        internalType: "contract IDSToken",
        name: "_poolToken",
        type: "address",
      },
      {
        internalType: "contract IERC20Token",
        name: "_reserveToken",
        type: "address",
      },
      { internalType: "uint256", name: "_poolAmount", type: "uint256" },
      {
        internalType: "uint256",
        name: "_reserveAmount",
        type: "uint256",
      },
      { internalType: "uint256", name: "_reserveRateN", type: "uint256" },
      { internalType: "uint256", name: "_reserveRateD", type: "uint256" },
      { internalType: "uint256", name: "_timestamp", type: "uint256" },
    ],
    name: "addProtectedLiquidity",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "contract IERC20Token",
        name: "_token",
        type: "address",
      },
      { internalType: "uint256", name: "_amount", type: "uint256" },
    ],
    name: "decSystemBalance",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "contract IERC20Token",
        name: "_token",
        type: "address",
      },
      { internalType: "uint256", name: "_amount", type: "uint256" },
    ],
    name: "incSystemBalance",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "contract IConverterAnchor",
        name: "_poolAnchor",
        type: "address",
      },
    ],
    name: "isPoolWhitelisted",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "_provider", type: "address" },
      { internalType: "uint256", name: "_index", type: "uint256" },
    ],
    name: "lockedBalance",
    outputs: [
      { internalType: "uint256", name: "", type: "uint256" },
      { internalType: "uint256", name: "", type: "uint256" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "_provider", type: "address" }],
    name: "lockedBalanceCount",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "_provider", type: "address" },
      { internalType: "uint256", name: "_startIndex", type: "uint256" },
      { internalType: "uint256", name: "_endIndex", type: "uint256" },
    ],
    name: "lockedBalanceRange",
    outputs: [
      { internalType: "uint256[]", name: "", type: "uint256[]" },
      { internalType: "uint256[]", name: "", type: "uint256[]" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "newOwner",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "_id", type: "uint256" }],
    name: "protectedLiquidity",
    outputs: [
      { internalType: "address", name: "", type: "address" },
      { internalType: "contract IDSToken", name: "", type: "address" },
      { internalType: "contract IERC20Token", name: "", type: "address" },
      { internalType: "uint256", name: "", type: "uint256" },
      { internalType: "uint256", name: "", type: "uint256" },
      { internalType: "uint256", name: "", type: "uint256" },
      { internalType: "uint256", name: "", type: "uint256" },
      { internalType: "uint256", name: "", type: "uint256" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "_provider", type: "address" }],
    name: "protectedLiquidityCount",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "_provider", type: "address" },
      { internalType: "uint256", name: "_index", type: "uint256" },
    ],
    name: "protectedLiquidityId",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "_provider", type: "address" }],
    name: "protectedLiquidityIds",
    outputs: [{ internalType: "uint256[]", name: "", type: "uint256[]" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "_provider", type: "address" },
      { internalType: "uint256", name: "_index", type: "uint256" },
    ],
    name: "removeLockedBalance",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "contract IConverterAnchor",
        name: "_poolAnchor",
        type: "address",
      },
    ],
    name: "removePoolFromWhitelist",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "_id", type: "uint256" }],
    name: "removeProtectedLiquidity",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "contract IERC20Token",
        name: "_token",
        type: "address",
      },
    ],
    name: "systemBalance",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "contract IDSToken",
        name: "_poolToken",
        type: "address",
      },
    ],
    name: "totalProtectedPoolAmount",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "contract IDSToken",
        name: "_poolToken",
        type: "address",
      },
      {
        internalType: "contract IERC20Token",
        name: "_reserveToken",
        type: "address",
      },
    ],
    name: "totalProtectedReserveAmount",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "_newOwner", type: "address" }],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "_id", type: "uint256" },
      {
        internalType: "uint256",
        name: "_newPoolAmount",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_newReserveAmount",
        type: "uint256",
      },
    ],
    name: "updateProtectedLiquidityAmounts",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "_index", type: "uint256" }],
    name: "whitelistedPool",
    outputs: [
      {
        internalType: "contract IConverterAnchor",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "whitelistedPoolCount",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "whitelistedPools",
    outputs: [
      {
        internalType: "contract IConverterAnchor[]",
        name: "",
        type: "address[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "contract IERC20Token",
        name: "_token",
        type: "address",
      },
      { internalType: "address", name: "_to", type: "address" },
      { internalType: "uint256", name: "_amount", type: "uint256" },
    ],
    name: "withdrawTokens",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];
