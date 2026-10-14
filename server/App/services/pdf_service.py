import os
from jinja2 import Environment, FileSystemLoader, select_autoescape
from weasyprint import HTML, CSS
from App.schemas.contract import ContractRequest

class PDFService:
    """
    Engine responsible for taking validated data schemas, compiling Jinja2 HTML templates,
    and rendering pixel-perfect PDF binary blobs via WeasyPrint.
    """

    def __init__(self):
        templates_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), "templates")
        self.env = Environment(
            loader=FileSystemLoader(templates_dir),
            autoescape=select_autoescape(["html", "xml"])
        )

    def generate_contract_pdf(self, data: ContractRequest) -> bytes:
        """
        Renders HTML template with populated values and converts it directly into a PDF byte stream.
        """
        template = self.env.get_template("contract.html")
        
        # Convert Pydantic payload model into dictionary for template rendering
        context = data.model_dump()
        
        # Format currency representation
        formatted_amount = f"{data.contract.total_amount:,.2f}"
        context["contract"]["formatted_amount"] = formatted_amount

        rendered_html = template.render(**context)

        # Inject CSS styling specifically tailored for document pagination
        styles_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), "templates", "styles.css")
        
        pdf_bytes = HTML(string=rendered_html).write_pdf(
            stylesheets=[CSS(filename=styles_path)]
        )
        return pdf_bytes

pdf_service = PDFService()