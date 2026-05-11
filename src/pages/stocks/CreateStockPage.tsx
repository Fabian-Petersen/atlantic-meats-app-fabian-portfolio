import { cn } from "@/lib/utils";
import FormHeading from "../../../customComponents/FormHeading";
// import CreateStockForm from "@/components/assets/CreateStockForm";
import { sharedStyles } from "@/styles/shared";
import CreateStockItemForm from "@/components/stocks/CreateStockItemForm";

/**
 * CreateStockPage
 * path: /stocks/create-new-stock
 *
 * This page allows users with the appropriate permissions to create a new stock.
 * It renders a form for inputting stock details and submitting them to the backend.
 *
 * Behavior:
 * - Renders a heading "Create Stock" and the CreateStockForm component.
 * - The form handles user input and submission logic internally.
 *
 * Data Flow:
 * - User fills out the form fields and submits the form.
 * - The CreateStockForm component processes the input and sends a POST request to the backend API to create the stock.
 *
 * Dependencies:
 * - FormHeading: A custom component for rendering section headings.
 * - CreateStockForm: A form component that manages state and submission for creating an asset.
 *
 * Styling:
 * - Uses shared styles from `sharedStyles` for consistent layout and theming across pages.
 *
 * Notes:
 * - Access to this page should be restricted based on user roles/permissions (handled via routing or higher-order components).
 */
const CreateStockPage = () => {
  return (
    <div className={cn(sharedStyles.pageContainer)}>
      <div className={cn(sharedStyles.pageContent)}>
        <FormHeading
          className={cn(sharedStyles.headingForm)}
          heading="Create Stock"
        />
        <CreateStockItemForm />
      </div>
    </div>
  );
};

export default CreateStockPage;
