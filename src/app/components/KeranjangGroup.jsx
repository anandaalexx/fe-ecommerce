// KeranjangGroup.jsx
const KeranjangGroup = ({
  group,
  onSelectToko,
  onSelectProduct,
  onQuantityChange,
}) => {
  return (
    <div className="mx-auto max-w-7xl bg-white border rounded-lg mb-4">
      <div className="flex items-center px-4 py-2 border-b">
        <input
          type="checkbox"
          checked={group.isSelected}
          onChange={onSelectToko}
        />
        <span>{group.namaToko}</span>
      </div>

      {group.items.map((item, idx) => (
        <div
          key={item.idDetailKeranjang}
          className="flex items-center px-4 py-3 border-t"
        >
          <input
            type="checkbox"
            checked={item.isSelected}
            onChange={() => onSelectProduct(idx)}
          />
          <div className="flex-1">{item.namaVarianProduk}</div>
          <div className="w-40 text-center">{item.harga.toLocaleString()}</div>
          <div className="w-40 text-center">
            <input
              type="number"
              value={item.kuantitas}
              onChange={(e) => onQuantityChange(idx, parseInt(e.target.value))}
              className="border rounded w-16 text-center"
              min={1}
            />
          </div>
          <div className="w-40 text-center font-bold">
            Rp {(item.harga * item.kuantitas).toLocaleString()}
          </div>
        </div>
      ))}
    </div>
  );
};

export default KeranjangGroup;
