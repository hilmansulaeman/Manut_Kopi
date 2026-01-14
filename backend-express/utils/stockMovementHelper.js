const StockMovement = require('../models/StockMovement');
const ProductStock = require('../models/ProductStock');

const recordStockMovement = async (productId, outletId, sourceType, sourceId, qtyChange, session) => {
    try {
        const productStock = await ProductStock.findOne({ product_id: productId, outlet_id: outletId });

        if (!productStock) {
            console.error(`Stock not found for product ${productId} at outlet ${outletId}. Cannot record movement.`);
            return;
        }

        const qty_in = qtyChange > 0 ? qtyChange : 0;
        const qty_out = qtyChange < 0 ? Math.abs(qtyChange) : 0;
        const balance_after = productStock.qty_on_hand; // This should be the balance *after* the change has been applied to ProductStock

        const newMovement = new StockMovement({
            product_id: productId,
            outlet_id: outletId,
            source_type: sourceType,
            source_id: sourceId,
            qty_in,
            qty_out,
            balance_after,
            moved_at: Date.now()
        });

        await newMovement.save({ session });
        console.log(`Stock movement recorded for product ${productId} (Source: ${sourceType}, ID: ${sourceId})`);
    } catch (error) {
        console.error('Error recording stock movement:', error);
        throw error; // Re-throw to ensure transaction rollback if used
    }
};

module.exports = recordStockMovement;
