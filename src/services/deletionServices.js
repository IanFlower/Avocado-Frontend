// eventService.js
import { apiClient } from './services.js';

const deletionServices = {
    deleteItem(category, item) {
        return apiClient.delete(`/${category.value}/${item.value.id}`);
    }
};

export default deletionServices;
