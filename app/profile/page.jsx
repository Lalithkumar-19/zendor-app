"use client";
import { Suspense } from 'react';

function ProfileContent() {
  const searchParams = useSearchParams();
  const to = searchParams.get("to");
  const router = useRouter();

  const [current, setCurrent] = useState(() => {
    // Initialize current state based on 'to' parameter
    return to === "3" ? 3 : 1;
  });
  const loginStatus = useSelector((state) => state.user?.token);
  if (!loginStatus) {
    router.push("/login");
  }

  const [userData, setUserData] = useState({
    userName: "",
    email: "",
    phone: "",
    profilePicture: "",
    createdAt: "",
    orders: [],
    MoodBoard: [],
    cart: [],
    billingAddress: {},
    shippingAddress: {},
    role: "",
  });
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  // Add effect to handle 'to' parameter changes
  useEffect(() => {
    if (to === "3") {
      setCurrent(3);
    }
  }, [to]);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axiosInstance.get("/user/getUserProfile");
        console.log(response.data, "userData");
        if (response.status === 200) {
          const userData = response.data.data;
          setUserData({
            userName: userData.userName || "Guest User",
            email: userData.email || "",
            phone: userData.phone === "None" ? "" : userData.phone,
            profilePicture:
              userData.profilePicture === "None"
                ? null
                : userData.profilePicture,
            createdAt: userData.createdAt,
            orders: userData.orders || [],
            MoodBoard: userData.MoodBoard || [],
            cart: userData.cart || [],
            billingAddress: userData.billingAddress || {},
            shippingAddress: userData.shippingAddress || {},
            role: userData.role || "customer",
          });
        }
      } catch (error) {
        console.error("Failed to fetch user profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  // Remove this line as it's causing infinite re-renders
  // setCurrent();

  const CurrentComponent =
    menuItems.find((item) => item.id === current)?.component || Dashboard;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const handleSignOut = () => {
     if (typeof window !== 'undefined') {
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    localStorage.removeItem("name");
    localStorage.removeItem("role");
  }
  dispatch(logout());
  router.push("/");
  };

  return (
    <div className="mt-1 min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center sm:text-left">
          My Account
        </h1>

        <div className="flex flex-col sm:flex-row gap-8">
          {/* Sidebar */}
          <aside className="hidden sm:block w-64 shrink-0">
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
              <div className="text-center mb-6">
                <div className="relative w-24 h-24 mx-auto mb-4">
                  {userData.profilePicture ? (
                    <Image
                      src={userData.profilePicture}
                      alt="Profile"
                      width={96}
                      height={96}
                      className="rounded-full object-cover w-full h-full ring-4 ring-gray-50"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-full ring-4 ring-gray-50">
                      <UserCircle size={80} className="text-gray-400" />
                    </div>
                  )}
                  <span className="absolute bottom-0 right-0 w-4 h-4 bg-green-400 border-2 border-white rounded-full" />
                </div>
                <h2 className="font-semibold text-gray-900">
                  {userData.userName}
                </h2>
                <p className="text-sm text-gray-500">
                  Member since {new Date(userData.createdAt).getFullYear()}
                </p>
                {userData.role && (
                  <span className="inline-block mt-2 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                    {userData.role.charAt(0).toUpperCase() +
                      userData.role.slice(1)}
                  </span>
                )}
              </div>

              <nav className="space-y-1">
                {menuItems.map((item) => (
                  <NavButton
                    key={item.id}
                    item={item}
                    isActive={current === item.id}
                    onClick={() => setCurrent(item.id)}
                  />
                ))}
                <button
                  onClick={handleSignOut}
                  className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <LogOut size={20} />
                  <span className="font-medium">Sign Out</span>
                </button>
              </nav>
            </div>
          </aside>

          {/* Mobile Navigation */}
          <nav className="sm:hidden fixed bottom-0 left-0 right-0 bg-white border-t z-50">
            <div className="flex justify-around p-2">
              {menuItems.map((item) => (
                <NavButton
                  key={item.id}
                  item={item}
                  isActive={current === item.id}
                  onClick={() => setCurrent(item.id)}
                  isMobile
                />
              ))}
            </div>
          </nav>

          {/* Main Content */}
          <main className="flex-1 bg-white rounded-xl shadow-sm p-6">
            {current === 1 ? (
              <Dashboard userData={userData} setCurrent={setCurrent} />
            ) : (
              <CurrentComponent userData={userData} />
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ProfileContent />
    </Suspense>
  );
}
