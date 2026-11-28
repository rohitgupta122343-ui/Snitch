import { useDispatch } from 'react-redux';
import { getOrder, createOrder } from '../services/order.service';
import { setOrderId, clearOrderId } from '../state/order.slice';

export function useOrder() {
  const dispatch = useDispatch();

  async function handleCreateOrderr({ razorpayOrderId }) {

    const data = await createOrder({ razorpayOrderId });
    console.log(razorpayOrderId)
    
    if (data?.order?._id) {
      dispatch(setOrderId(data.order._id));
    }

    return data.order;
  }

  async function handleGetOrder({ orderId }) {

    const data = await getOrder({ orderId });
    return data.order;
    
  }

  function handleClearOrder() {
    dispatch(clearOrderId());
  }

  return {
    handleCreateOrderr,
    handleGetOrder,
    handleClearOrder,
  };
}