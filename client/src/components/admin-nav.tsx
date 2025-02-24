{/* ... other import statements ... */}
import Link from 'next/link'; // Assuming you're using Next.js for routing.  Adjust if necessary.
import cn from 'classnames'; // Assuming you're using classnames for styling. Adjust if necessary.

// ... other components and functions ...


function AdminNav() { // Assuming this is your admin navigation component. Adjust if necessary.
  const buttonVariants = ({ variant }) => ({
    ghost: 'text-gray-600 hover:text-gray-800',
    primary: 'text-white bg-primary hover:bg-primary-dark',
  })[variant];


  return (
    <nav>
      {/* ... other navigation links ... */}
      <Link href="/admin/products" className={cn(buttonVariants({ variant: "ghost" }), "justify-start")}>
        Məhsullar
      </Link>
      <Link href="/admin/categories" className={cn(buttonVariants({ variant: "ghost" }), "justify-start")}>
        Kateqoriyalar
      </Link>
      <Link href="/admin/messages" className={cn(buttonVariants({ variant: "ghost" }), "justify-start")}>
        Mesajlar
      </Link>
      {/* ... other navigation links ... */}
    </nav>
  );
}

// ... rest of the code ...

export default AdminNav; // or whatever your export statement is