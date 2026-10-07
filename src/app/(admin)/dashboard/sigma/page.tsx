'use client';

import { WrapperContent, HeaderContent } from '../style';

export default function Sigma() {
  return (
    <WrapperContent>
      <HeaderContent>
        <h3>Área Sigma</h3>
      </HeaderContent>

      <div
        style={{
          padding: '40px',
          backgroundColor: '#fff',
          borderRadius: '8px',
          textAlign: 'center'
        }}
      >
        <p style={{ color: '#666', fontSize: '1.1em' }}>
          Página exclusiva para usuários Sigma. Em construção.
        </p>
      </div>
    </WrapperContent>
  );
}
