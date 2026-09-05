from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field

class ParottaAnalysisResponse(BaseModel):
    is_parotta: bool = Field(..., description="Whether the uploaded image appears to contain a parotta")
    estimated_layers: int = Field(..., description="Estimated count of visible dough layers")
    confidence: int = Field(..., description="Confidence percentage in layer estimation (0-100)")
    flakiness_score: int = Field(..., description="Flakiness and lamination score (0-100)")
    layer_density: str = Field(..., description="Category: Low, Medium, High, or Extreme")
    circularity: int = Field(..., description="Circularity percentage (0-100)")
    quality_score: int = Field(..., description="Overall Parotta Quality Score (0-100)")
    verdict: str = Field(..., description="Official humorous verdict from the Parotta Council")
    annotated_image: Optional[str] = Field(None, description="Base64 data URL of annotated image with highlighted layers")
    edge_image: Optional[str] = Field(None, description="Base64 data URL of high-contrast layer boundary edge map")
    heatmap_image: Optional[str] = Field(None, description="Base64 data URL of flakiness/texture density heatmap")
    scientific_metrics: Optional[Dict[str, Any]] = Field(default_factory=dict, description="Pseudoscientific CV metrics")
    humorous_notes: Optional[List[str]] = Field(default_factory=list, description="Funny analytical observations")
    suggested_accompaniment: Optional[str] = Field(None, description="Recommended curry/roast pairing")
    error_message: Optional[str] = Field(None, description="Error message if not a parotta")

class SampleImageInfo(BaseModel):
    id: str
    name: str
    description: str
    category: str
    image_url: str
