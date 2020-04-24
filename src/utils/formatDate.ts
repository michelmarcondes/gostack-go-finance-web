const formatDate = (value: Date): string =>
  Intl.DateTimeFormat('pt-BR', {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
  }).format(value);

export default formatDate;
