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
    data: {
      chk_sabor_2: false,
      chk_sabor_4: false,
      chk_sabor_6: false,
      chk_sabor_8: false,
      chk_sabor_10: false,

      chk_sa_especial: false,
      chk_sa_filete_pollo: false,
      chk_sa_criollo: false,
      chk_sa_blaugrana: false,
      chk_sa_capricho: false,
      chk_sa_hawaiano: false,

      chk_ar_especial: false,
      chk_ar_mixta: false,
      chk_ar_carnes: false,
      chk_ar_pollo_jamon: false,
      chk_ar_pollo_champ: false,
      chk_ar_hawaiana: false,

      chk_pe_tropical: false,
      chk_pe_sls_champ: false,
      chk_pe_sls_ciruela: false,
      chk_pe_miel_mostaza: false,

      chk_pan_especial: false,
      chk_pan_mixto: false,
      chk_pan_carnes: false,
      chk_pan_blaugrana: false,
      chk_pan_pollo_jamon: false,
      chk_pan_pollo_champ: false,
      chk_pan_pollo_camaron: false,
      chk_pan_hawaiano: false,

      chk_esp_tradicional: false,
      chk_esp_tradicional_gratinado: false,
      chk_esp_especial: false,
      chk_las_especial: false,
      chk_las_palles: false,
      chk_las_tradicional: false,
      chk_canelones: false,

      chk_str_especial: false,
      chk_str_carnes: false,
      chk_str_blaugrana: false,
      chk_str_pollo_jamon: false,
      chk_str_pollo_champ: false,
      chk_str_hawaiano: false,

      chk_maiz_tradicional: false,
      chk_maiz_especial: false,
      chk_maduro_tradicional: false,
      chk_menu_infantil: false,
      chk_papas_locas: false,
      chk_papas_francesa: false,
    },
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
          data: {
            ...SCREEN_RESPONSES.CANTIDADES.data,
            ...data,
          },
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
