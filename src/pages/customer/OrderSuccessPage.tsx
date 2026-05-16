import { CheckCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Button } from "../../components/common/Button";
import { getOrder } from "../../services/orderService";
import type { Order } from "../../types/order";

export function OrderSuccessPage() {
  const { orderId = "" } = useParams();
  const [order, setOrder] = useState<Order>();

  useEffect(() => {
    getOrder(orderId).then(setOrder);
  }, [orderId]);

  return (
    <div className="mx-auto max-w-2xl rounded-2xl bg-white p-8 text-center shadow-lift">
      <CheckCircle className="mx-auto text-green-600" size={72} />
      <h1 className="mt-4 text-3xl font-extrabold">Order placed successfully</h1>
      <p className="mt-2 text-muted">Order number: <strong className="text-ink">{order?.orderNumber}</strong></p>
      <p className="text-muted">Estimated delivery time: 45 minutes</p>
      <div className="mt-7 flex flex-wrap justify-center gap-3">
        <Link to={`/orders/${orderId}`}><Button>Track order</Button></Link>
        <Link to="/menu"><Button variant="secondary">Continue browsing</Button></Link>
      </div>
    </div>
  );
}
