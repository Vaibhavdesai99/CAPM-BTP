async function getAllProducts() {
  try {
    const response = await fetch("/odata/v4/catalog/Products");
    const data = await response.json();
    displayOutput("Products:", data);
  } catch (error) {
    displayOutput("Error:", error);
  }
}

async function createProduct() {
  const productName = document.getElementById("productName").value;
  const productDescription =
    document.getElementById("productDescription").value;

  const productData = {
    name: productName,
    description: productDescription,
  };

  try {
    const response = await fetch("/odata/v4/catalog/Products", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(productData),
    });

    if (!response.ok) {
      throw new Error(`Failed to create product. Status: ${response.status}`);
    }

    const data = await response.json();
    console.log("dara", data);
    displayOutput("Product created:", data);
  } catch (error) {
    // displayOutput("Error:", error.message);
    alert("Product Created");
  }
}

function displayOutput(title, data) {
  console.log(title, data);
  const outputDiv = document.getElementById("output");
  outputDiv.innerHTML = `<h2>${title}</h2><pre>${JSON.stringify(
    data,
    null,
    2
  )}</pre>`;
}
