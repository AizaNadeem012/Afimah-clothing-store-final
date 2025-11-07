import React from "react";
import { Facebook, Instagram, Twitter, MapPin, Phone, Mail, MessageCircle } from "lucide-react";

const Footer: React.FC = () => {
	return (
		<footer className="w-full bg-[#3B3A39] text-white relative overflow-hidden">
			<div className="absolute top-0 left-10 w-40 h-40 bg-[#B89D94]/10 rounded-full blur-3xl"></div>
			<div className="absolute bottom-10 right-20 w-60 h-60 bg-[#B89D94]/15 rounded-full blur-3xl"></div>

			<div className="container mx-auto px-4 py-16 relative z-10">
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
					<div>
						<div className="flex items-center gap-3 mb-4">
							<div className="h-12 w-12 rounded-full overflow-hidden">
								<img src="/logo.png" alt="Afimah" className="h-full w-full object-cover" />
							</div>
							<span className="text-2xl font-serif font-semibold text-[#B89D94]">Afimah</span>
						</div>
						<p className="text-[#D4CFCB] mb-4">
							Modern elegance for the confident woman. Curated collections blending tradition with contemporary style.
						</p>
						<div className="flex gap-3">
							<a href="https://facebook.com" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg[#B89D94]/20 flex items-center justify-center hover:bg-[#B89D94]/30 transition-all">
								<Facebook className="h-5 w-5 text-[#B89D94]" />
							</a>
							<a href="https://instagram.com" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-[#B89D94]/20 flex items-center justify-center hover:bg-[#B89D94]/30 transition-all">
								<Instagram className="h-5 w-5 text-[#B89D94]" />
							</a>
							<a href="https://twitter.com" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-[#B89D94]/20 flex items-center justify-center hover:bg-[#B89D94]/30 transition-all">
								<Twitter className="h-5 w-5 text-[#B89D94]" />
							</a>
						</div>
					</div>

					<div>
						<h4 className="text-lg font-semibold mb-4 text-[#B89D94]">Shop</h4>
						<ul className="space-y-2">
							<li><button className="text-[#D4CFCB] hover:text-white transition-colors text-left">New Arrivals</button></li>
							<li><button className="text-[#D4CFCB] hover:text-white transition-colors text-left">Best Sellers</button></li>
							<li><button className="text-[#D4CFCB] hover:text-white transition-colors text-left">Limited Edition</button></li>
							<li><button className="text-[#D4CFCB] hover:text-white transition-colors text-left">Lookbook</button></li>
						</ul>
					</div>

					<div>
						<h4 className="text-lg font-semibold mb-4 text-[#B89D94]">Customer Care</h4>
						<ul className="space-y-2">
							<li><a href="#" className="text-[#D4CFCB] hover:text-white transition-colors">Contact Us</a></li>
							<li><a href="#" className="text-[#D4CFCB] hover:text-white transition-colors">Shipping & Returns</a></li>
							<li><a href="#" className="text-[#D4CFCB] hover:text-white transition-colors">Size Guide</a></li>
							<li><a href="#" className="text-[#D4CFCB] hover:text-white transition-colors">Care Instructions</a></li>
						</ul>
					</div>

					<div>
						<h4 className="text-lg font-semibold mb-4 text-[#B89D94]">Contact Info</h4>
						<ul className="space-y-3 text-[#D4CFCB]">
							<li className="flex items-center gap-3">
								<MapPin className="h-5 w-5 text-[#B89D94]" />
								<span>123 Fashion Street, Lahore, Pakistan</span>
							</li>
							<li className="flex items-center gap-3">
								<Phone className="h-5 w-5 text-[#B89D94]" />
								<span>03279441855</span>
							</li>
							<li className="flex items-center gap-3">
								<Mail className="h-5 w-5 text-[#B89D94]" />
								<span>info@afimah.com</span>
							</li>
							<li className="flex items-center gap-3">
								<MessageCircle className="h-5 w-5 text-[#B89D94]" />
								<span>WhatsApp: 03279441855</span>
							</li>
						</ul>
					</div>
				</div>

				<div className="border-t border-[#B89D94]/30 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-[#D4CFCB]">
					<p className="mb-4 md:mb-0">© {new Date().getFullYear()} Afimah Clothing Store. All rights reserved.</p>
					<div className="flex gap-6">
						<a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
						<a href="#" className="hover:text-white transition-colors">Terms of Service</a>
						<a href="#" className="hover:text-white transition-colors">Cookie Policy</a>
					</div>
				</div>
			</div>
		</footer>
	);
};

export default Footer;
