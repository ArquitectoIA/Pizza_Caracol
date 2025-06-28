const CATEGORIAS = [
  "pizza",
  "sandwich",
  "arepizza",
  "pechuga",
  "panzerotti",
  "pasta",
  "stromboly",
  "variedades",
];

const SCREEN_RESPONSES = {
  MENU_PRINCIPAL: {
    screen: "MENU_PRINCIPAL",
    data: {},
  },
  SELECCION_PRODUCTOS: {
    screen: "SELECCION_PRODUCTOS",
    data: {
      chk_pizza: false,
      chk_pizza_1: false,
      chk_pizza_2: false,
      chk_pizza_3: false,
      chk_pizza_4: false,
      chk_pizza_5: false,
      chk_sandwich: false,
      chk_arepizza: false,
      chk_pechuga: false,
      chk_panzerotti: false,
      chk_pasta: false,
      chk_stromboly: false,
      chk_variedades: false,
    },
  },
  CANTIDADES: {
    screen: "CANTIDADES",
    data: {},
  },
  BEBIDAS: {
    screen: "BEBIDAS",
    data: {},
  },
  SUCCESS: {
    screen: "SUCCESS",
    data: {
      extension_message_response: {
        params: {
          flow_token: "REPLACE_FLOW_TOKEN",
          some_param_name: "PASS_CUSTOM_VALUE",
        },
      },
    },
  },
};

export const getNextScreen = async (decryptedBody) => {
  const { screen, data, version, action, flow_token } = decryptedBody;

  // handle health check request
  if (action === "ping") {
    return {
      data: {
        status: "active",
      },
    };
  }

  // handle error notification
  if (data?.error) {
    console.warn("Received client error:", data);
    return {
      data: {
        acknowledged: true,
      },
    };
  }

  // handle initial request when opening the flow and display LOAN screen
  if (action === "INIT") {
    return {
      ...SCREEN_RESPONSES.MENU_PRINCIPAL,
    };
  }

  if (action === "data_exchange") {
    // handle the request based on the current screen
    switch (screen) {
      // handles when user submits PRODUCT_SELECTOR screen
      case "MENU_PRINCIPAL":
        const CATEGORIAS_SELECCIONADAS = new Set(
          data.categoria_seleccionada ?? []
        );
        const CATEGORIAS_CHK = CATEGORIAS.reduce((acc, id) => {
          acc[`chk_${id}`] = CATEGORIAS_SELECCIONADAS.has(id);
          return acc;
        }, {});
        return {
          ...SCREEN_RESPONSES.SELECCION_PRODUCTOS,
          data: {
            ...SCREEN_RESPONSES.SELECCION_PRODUCTOS.data,
            ...CATEGORIAS_CHK,
          },
        };

      case "SELECCION_PRODUCTOS":
        // TODO here process user selected preferences and return customised offer
        return {
          ...SCREEN_RESPONSES.CANTIDADES,
        };

      case "CANTIDADES":
        // TODO return details of selected device
        return {
          ...SCREEN_RESPONSES.BEBIDAS,
        };

      default:
        break;
    }
  }

  console.error("Unhandled request body:", decryptedBody);
  throw new Error(
    "Unhandled endpoint request. Make sure you handle the request action & screen logged above."
  );
};
