import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { User } from 'shared';

const fetchCustomer = async (customerId: string): Promise<User> => {
  const { data } = await axios.get(`/api/customers/${customerId}`);
  return data;
};

export const useCustomerQuery = (customerId: string) => {
  return useQuery<User, Error>({
    queryKey: ['customer', customerId],
    queryFn: () => fetchCustomer(customerId),
    enabled: !!customerId,
  });
};