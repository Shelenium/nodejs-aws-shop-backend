exports.handler = async function(event: any) {
    console.log("Event:", JSON.stringify(event));

    // Mock data for products
    const products = [
        { id: "1", title: "Product 1", description: "Description 1", price: 100 },
        { id: "2", title: "Product 2", description: "Description 2", price: 200 },
        { id: "3", title: "Product 3", description: "Description 3", price: 300 }
    ];

    return {
        statusCode: 200,
        headers: { 
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify(products)
    };
};
