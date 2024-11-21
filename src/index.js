const fs = require('fs');
const filePath = './data/data.csv';
let data = fs.readFileSync(filePath, 'utf-8');
data = data.split('\n').slice(1);  // Skip the header row

// Helper functions to process the data
function totalSales(data) {
    return data.reduce((total, line) => {
        const fields = line.split(',');
        return total + parseFloat(fields[4]);  // Total Price is at index 4
    }, 0);
}

function monthWiseSales(data) {
    const sales = {};
    data.forEach(line => {
        const fields = line.split(',');
        const date = new Date(fields[0]);
        const month = date.toLocaleString('default', { month: 'long', year: 'numeric' });
        sales[month] = (sales[month] || 0) + parseFloat(fields[4]);
    });
    return sales;
}

function mostPopularItemEachMonth(data) {
    const itemCounts = {};
    data.forEach(line => {
        const fields = line.split(',');
        const date = new Date(fields[0]);
        const month = date.toLocaleString('default', { month: 'long', year: 'numeric' });
        const item = fields[1];
        const quantity = parseInt(fields[3]);
        
        if (!itemCounts[month]) itemCounts[month] = {};
        if (!itemCounts[month][item]) itemCounts[month][item] = 0;
        itemCounts[month][item] += quantity;
    });
    
    const popularItems = {};
    for (const month in itemCounts) {
        popularItems[month] = Object.entries(itemCounts[month]).reduce((max, [item, quantity]) => 
            quantity > max[1] ? [item, quantity] : max, ['', 0])[0];
    }
    
    return popularItems;
}

function itemsGeneratingMostRevenue(data) {
    const revenue = {};
    data.forEach(line => {
        const fields = line.split(',');
        const date = new Date(fields[0]);
        const month = date.toLocaleString('default', { month: 'long', year: 'numeric' });
        const item = fields[1];
        const revenueGenerated = parseFloat(fields[4]);
        
        if (!revenue[month]) revenue[month] = {};
        revenue[month][item] = (revenue[month][item] || 0) + revenueGenerated;
    });
    
    const maxRevenueItems = {};
    for (const month in revenue) {
        maxRevenueItems[month] = Object.entries(revenue[month]).reduce((max, [item, rev]) => 
            rev > max[1] ? [item, rev] : max, ['', 0])[0];
    }
    
    return maxRevenueItems;
}

function minMaxAvgOrdersOfPopularItems(data) {
    const itemOrders = {};
    data.forEach(line => {
        const fields = line.split(',');
        const date = new Date(fields[0]);
        const month = date.toLocaleString('default', { month: 'long', year: 'numeric' });
        const item = fields[1];
        const quantity = parseInt(fields[3]);
        
        if (!itemOrders[month]) itemOrders[month] = {};
        if (!itemOrders[month][item]) itemOrders[month][item] = [];
        itemOrders[month][item].push(quantity);
    });
    
    const itemStats = {};
    for (const month in itemOrders) {
        for (const item in itemOrders[month]) {
            const quantities = itemOrders[month][item];
            const min = Math.min(...quantities);
            const max = Math.max(...quantities);
            const avg = quantities.reduce((sum, q) => sum + q, 0) / quantities.length;
            
            if (!itemStats[month]) itemStats[month] = {};
            itemStats[month][item] = { min, max, avg };
        }
    }
    
    return itemStats;
}

// Usage
console.log('Total Sales:', totalSales(data));
console.log('Month-wise Sales:', monthWiseSales(data));
console.log('Most Popular Item Each Month:', mostPopularItemEachMonth(data));
console.log('Items Generating Most Revenue Each Month:', itemsGeneratingMostRevenue(data));
console.log('Min, Max, and Average Orders of Popular Items:', minMaxAvgOrdersOfPopularItems(data));
