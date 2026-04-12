import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import { ReactNode } from "react";

type MobileTopBarProps = {
    children: ReactNode;
};

export default function MobileTopBar({ children }: MobileTopBarProps) {
    return (
        <div className="d-md-none shell-root">
            <div className="container-fluid h-100">
                <div className="row">
                    <aside className="col-1 d-flex justify-content-center pt-3">
                        <p className="brand-logo brand-logo-mobile">m.</p>
                    </aside>
                    <div className="col-10"></div>
                    <aside className="col-1 d-flex pt-3">
                        <button type="button" className="btn btn-link p-0 text-dark" aria-label="Open search">
                            <SearchOutlinedIcon fontSize="small" />
                        </button>
                    </aside>
                </div>
                <div className="row">
                    <div className="col-1"></div>
                    <div className="col-10">
                        <main className="col-10 shell-scroll p-3">{children}</main>
                    </div>
                    <div className="col-1"></div>
                </div>
            </div>
        </div>
    );
}
