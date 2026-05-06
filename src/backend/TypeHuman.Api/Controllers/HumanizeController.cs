using Microsoft.AspNetCore.Mvc;

namespace TypeHuman.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class HumanizeController : ControllerBase
{
    [HttpPost]
    public ActionResult<HumanizeResponse> Post([FromBody] HumanizeRequest request)
    {
        // Simple mock implementation - later, we will use ML.NET or an LLM endpoint here
        var transformedText = request.Persona.ToLower() switch
        {
            "ceo" => $"Let me be extremely clear: {request.Text} We need to scale this immediately.",
            "child" => $"Look! {request.Text} It is so much fun!",
            _ => $"Hey there! To be honest with you, {request.Text}",
        };

        var response = new HumanizeResponse
        {
            OriginalText = request.Text,
            Persona = request.Persona,
            TransformedText = transformedText
        };

        return Ok(response);
    }
}

public class HumanizeRequest
{
    public string Text { get; set; } = string.Empty;
    public string Persona { get; set; } = string.Empty;
}

public class HumanizeResponse
{
    public string OriginalText { get; set; } = string.Empty;
    public string Persona { get; set; } = string.Empty;
    public string TransformedText { get; set; } = string.Empty;
}