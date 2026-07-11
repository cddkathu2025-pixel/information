// test_otop.js
import { AssertionError } from 'assert';

// Mock localStorage
const mockLocalStorage = (() => {
  let store = {};
  return {
    getItem: (key) => store[key] || null,
    setItem: (key, value) => { store[key] = String(value); },
    removeItem: (key) => { delete store[key]; },
    clear: () => { store = {}; }
  };
})();
globalThis.localStorage = mockLocalStorage;

// Import db module dynamically after localStorage is mocked
const { 
  initializeECCDatabase, 
  getOtopProducts, 
  addOtopProduct, 
  updateOtopProduct, 
  deleteOtopProduct,
  getDistricts
} = await import('./src/db.js');

function assert(condition, message) {
  if (!condition) {
    throw new AssertionError({ message });
  }
}

async function runTests() {
  console.log('🧪 Starting OTOP System Tests...\n');

  // Test 1: Database Initialization & Seeding
  console.log('Test 1: Initializing database and checking seeded OTOP products...');
  localStorage.clear();
  initializeECCDatabase();
  
  const products = getOtopProducts();
  assert(products.length === 7, `Expected 7 seeded OTOP products, got ${products.length}`);
  
  // Verify that all seeded products have correct keys
  products.forEach(p => {
    assert(p.id !== undefined, 'Product should have an id');
    assert(p.name !== undefined, `Product should have a name, got ${JSON.stringify(p)}`);
    assert(p.type !== undefined, `Product should have a type, got ${JSON.stringify(p)}`);
    assert(p.district !== undefined, `Product should have a district, got ${JSON.stringify(p)}`);
    assert(p.sale !== undefined, `Product should have a sale amount, got ${JSON.stringify(p)}`);
    assert(p.star !== undefined, `Product should have a rating, got ${JSON.stringify(p)}`);
  });
  console.log('✅ Test 1 Passed: Seeding is correct and all fields are present.\n');

  // Test 2: Dynamic District Sales Calculation
  console.log('Test 2: Verifying dynamic OTOP sales calculation per subdistrict...');
  const districts = getDistricts();
  
  // Calculate expected sales from products
  const kathuExpected = products.filter(p => p.district === 'ตำบลกะทู้').reduce((sum, p) => sum + p.sale, 0);
  const patongExpected = products.filter(p => p.district === 'ตำบลป่าตอง').reduce((sum, p) => sum + p.sale, 0);
  const kamalaExpected = products.filter(p => p.district === 'ตำบลกมลา').reduce((sum, p) => sum + p.sale, 0);
  
  const kathuActual = districts.find(d => d.name === 'ตำบลกะทู้').otopSales;
  const patongActual = districts.find(d => d.name === 'ตำบลป่าตอง').otopSales;
  const kamalaActual = districts.find(d => d.name === 'ตำบลกมลา').otopSales;
  
  assert(kathuActual === kathuExpected, `Kathu sales mismatch: expected ${kathuExpected}, got ${kathuActual}`);
  assert(patongActual === patongExpected, `Patong sales mismatch: expected ${patongExpected}, got ${patongActual}`);
  assert(kamalaActual === kamalaExpected, `Kamala sales mismatch: expected ${kamalaExpected}, got ${kamalaActual}`);
  console.log('✅ Test 2 Passed: District sales match product sums perfectly.\n');

  // Test 3: Add OTOP Product (CRUD)
  console.log('Test 3: Testing adding a new OTOP product...');
  const newProduct = {
    name: 'สบู่สมุนไพรกมลา',
    type: 'สมุนไพรที่ไม่ใช่อาหาร',
    district: 'ตำบลกมลา',
    sale: 2000000,
    star: 5
  };
  
  const added = addOtopProduct(newProduct);
  assert(added.id !== undefined, 'Added product should have generated id');
  assert(added.name === newProduct.name, 'Name should match');
  assert(added.district === newProduct.district, 'District should match');
  
  const productsAfterAdd = getOtopProducts();
  assert(productsAfterAdd.length === 8, `Expected 8 products, got ${productsAfterAdd.length}`);
  
  // Check if Kamala OTOP sales increased dynamically
  const districtsAfterAdd = getDistricts();
  const kamalaActualAfterAdd = districtsAfterAdd.find(d => d.name === 'ตำบลกมลา').otopSales;
  assert(kamalaActualAfterAdd === kamalaExpected + 2000000, `Expected Kamala sales to be ${kamalaExpected + 2000000}, got ${kamalaActualAfterAdd}`);
  console.log('✅ Test 3 Passed: Adding product successfully updates list and dynamic district sales.\n');

  // Test 4: Update OTOP Product (CRUD)
  console.log('Test 4: Testing updating an OTOP product...');
  const productToUpdate = productsAfterAdd.find(p => p.name === 'สบู่สมุนไพรกมลา');
  const updatePayload = {
    ...productToUpdate,
    sale: 3500000 // Increase sale by 1,500,000
  };
  
  const updated = updateOtopProduct(productToUpdate.id, updatePayload);
  assert(updated.sale === 3500000, `Expected sale to be updated to 3500000, got ${updated.sale}`);
  
  const districtsAfterUpdate = getDistricts();
  const kamalaActualAfterUpdate = districtsAfterUpdate.find(d => d.name === 'ตำบลกมลา').otopSales;
  assert(kamalaActualAfterUpdate === kamalaExpected + 3500000, `Expected Kamala sales to be ${kamalaExpected + 3500000}, got ${kamalaActualAfterUpdate}`);
  console.log('✅ Test 4 Passed: Updating product successfully updates fields and dynamic district sales.\n');

  // Test 5: Delete OTOP Product (CRUD)
  console.log('Test 5: Testing deleting an OTOP product...');
  const productsBeforeDelete = getOtopProducts();
  const productToDelete = productsBeforeDelete.find(p => p.name === 'สบู่สมุนไพรกมลา');
  
  deleteOtopProduct(productToDelete.id);
  
  const productsAfterDelete = getOtopProducts();
  assert(productsAfterDelete.length === 7, `Expected product count to return to 7, got ${productsAfterDelete.length}`);
  assert(productsAfterDelete.find(p => p.id === productToDelete.id) === undefined, 'Deleted product should not be found');
  
  const districtsAfterDelete = getDistricts();
  const kamalaActualAfterDelete = districtsAfterDelete.find(d => d.name === 'ตำบลกมลา').otopSales;
  assert(kamalaActualAfterDelete === kamalaExpected, `Expected Kamala sales to return to ${kamalaExpected}, got ${kamalaActualAfterDelete}`);
  console.log('✅ Test 5 Passed: Deleting product successfully removes it and updates dynamic district sales.\n');

  console.log('🎉 All OTOP System Tests Completed Successfully!');
}

runTests().catch(err => {
  console.error('❌ Test Failed:', err);
  process.exit(1);
});
