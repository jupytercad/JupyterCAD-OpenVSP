import shutil
import tempfile
from typing import Optional
import openvsp as vsp
from os.path import join


def vsp3_to_stl(vsp_str: Optional[str]) -> str:
    stl_str = ""
    if not vsp_str:
        return stl_str
    tmp_path = tempfile.mkdtemp()
    vsp_temp_file = join(tmp_path, "temp.vsp3")
    stl_temp_file = join(tmp_path, "temp.stl")
    with open(vsp_temp_file, "w") as f:
        f.write(vsp_str)

    vsp.ReadVSPFile(vsp_temp_file)
    vsp.ExportFile(stl_temp_file, vsp.SET_ALL, vsp.EXPORT_STL)
    with open(stl_temp_file, "r") as stl_f:
        stl_str = stl_f.read()
    shutil.rmtree(tmp_path)
    return stl_str
