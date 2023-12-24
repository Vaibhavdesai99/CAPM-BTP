using  capmProject from '../db/schema';

service CatalogService {
    entity Products as projection on  capmProject.Products;
}