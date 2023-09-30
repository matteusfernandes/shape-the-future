type EvaluationConstant = {
  [key: string]: string;
};

export const evaluation: EvaluationConstant = {
  reqIdentify: 'Identificação',
  reqProject: 'Projeto',
  reqCreation: 'Criação',
  reqInteraction: 'Iteração',
  reqCommunication: 'Comunicação'
};

type Options = {
  [key: string]: {
    [key: number]: string;
  };
};

export const options: Options = {
  reqIdentify: {
    5: 'Problema não está claramente definido | Pouquíssima pesquisa',
    10: 'Definição do problema relativamente clara | Alguma pesquisa, mas qualidade duvidosa',
    15: 'Definição do problema totalmente clara | Grande variedade de pesquisa de qualidade',
    20: 'Trabalho impecável no critério avaliado'
  },
  reqProject: {
    5: 'Equipe gerou pouquíssimas ideias | Pouquíssimo planejamento com participação de alguns membros da equipe',
    10: 'Evidências de que a equipe gerou algumas ideias | Alguma planejamento de efetivo com participação de alguns membros do grupo',
    15: 'Evidências de que a equipe gerou muitas ideias | Planejamento altamente efetivo com participação de todos os membros do grupo',
    20: 'Trabalho impecável no critério avaliado'
  },
  reqCreation: {
    5: 'Desenvolvimento mínimo de solução inovadora | Nenhum protótipo/desenho da solução',
    10: 'Desenvolvimento parcial de solução inovadora | Protótipo/desenho simples que ajuda a compartilhar a solução',
    15: 'Desenvolvimento integral da solução inovadora | Protótipo/desenho detalhado que ajuda a compartilhar a solução',
    20: 'Trabalho impecável no critério avaliado'
  },
  reqInteraction: {
    5: 'Solução minimamente compartilhada | Pouquícissimas evidências de melhorias na solução',
    10: 'Solução moderamente compartilhada | Algumas evidências de melhorias na solução',
    15: 'Solução amplamente compartilhada | Muitas evidências de melhorias na solução',
    20: 'Trabalho impecável no critério avaliado'
  },
  reqCommunication: {
    5: 'Apresentação minimamente engajadora | A solução e seu potencial impacto sobre os outros não estão claros',
    10: 'Apresentação relativamente engajadora | A solução e seu potencial impacto sobre os outros estão parcialmente claros',
    15: 'Apresentação muito engajadora | A solução e seu potencial impacto sobre os outros estão totalmente claros',
    20: 'Trabalho impecável no critério avaliado'
  }
};
