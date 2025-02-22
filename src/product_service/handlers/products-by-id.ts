exports.handler = async function(event: any) {
    console.log("Event:", JSON.stringify(event));

    // Mock data for product-by-id
    const product = {
        id: "1", title: "Product 1", description: "Description 1", price: 100,
    };

    return {
        statusCode: 200,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(product)
    };
};
