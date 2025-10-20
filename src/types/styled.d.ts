import 'styled-components';

declare module 'styled-components' {
  export interface DefaultTheme {
    COLORS: {
      WHITE: {
        900: string;
        100: string;
      };
      BLUE: {
        200: string;
      };
    };
  }
}
