function GetInput(inputElement) {
    const data = inputElement.value.trim();
    if (!data) {
        console.warn(`${inputElement.placeholder} is Empty!`);
        return "";
    }
    return data;
}

export { GetInput };