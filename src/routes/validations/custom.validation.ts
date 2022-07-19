const objectId = (value: string, helpers: Record<string, any>) => {
  console.log("helpers", helpers);

  if (!value.match(/^[0-9a-fA-F]{24}$/)) {
    return helpers.message('"{{#label}}" must be a valid mongo id');
  }
  return value;
};

export { objectId };
