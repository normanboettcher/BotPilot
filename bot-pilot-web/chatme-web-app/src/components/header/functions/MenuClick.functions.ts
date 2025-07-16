const onMenuClick = (element: string) => {
  document.getElementById(element)?.scrollIntoView({ behavior: 'smooth' });
};

export default onMenuClick;
